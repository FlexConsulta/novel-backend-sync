import "dotenv/config";
import express from "express";
import ServerController from "./controllers/servers.controller";
import DatabasesController from "./controllers/databases.controller";
import syncDatabase from "./database/syncSchema";
import LogController from "./controllers/logs.controller";
import { QueryTypes } from "sequelize";

const { PORT, HOST } = process.env;

const servers = await ServerController.getAllServers();
const databases = await DatabasesController.getAllDataBases();

const sql1 = `select count(*) from conhecimento where conhecimento.datadigitacao BETWEEN CURRENT_DATE - '30 days'::interval AND CURRENT_DATE`;

servers.forEach(async (server) => {
  databases
    .filter((database) => database.id_server === server.id)
    .forEach(async (database) => {
      try {
        let logDescription;
        let status_connection = 200;
        try {
          const model_main = syncDatabase(
            database.name_default,
            database.user_default,
            database.password_default,
            server.url,
            "postgres",
            server.port,
            false
          );
          const sql1Main = await model_main.query(sql1, {
            type: QueryTypes.SELECT,
          });

          logDescription = { travelsDefault: sql1Main[0].count };
        } catch (error) {
          logDescription = { travelsDefault: "Erro" };
          status_connection = 500;
        }

        try {
          const model_customer = syncDatabase(
            database.name_client,
            database.user_client,
            database.password_client,
            database.hostname_client,
            "postgres",
            database.port_client,
            false
          );
          const sql1Customer = await model_customer.query(sql1, {
            type: QueryTypes.SELECT,
          });

          logDescription = {
            ...logDescription,
            travelsCustomer: sql1Customer[0].count,
          };
        } catch (error) {
          logDescription = { ...logDescription, travelsCustomer: "Erro" };
          status_connection = 500;
        }

        const logData = {
          description: JSON.stringify(logDescription),
          id_database: database.id,
          status_connection,
        };

        LogController.createLog(logData);
      } catch (error) {
        const logData = {
          description: JSON.stringify(logDescription),
          id_database: database.id,
          status_connection: 500,
        };
        LogController.createLog(logData);
        console.log(
          `database:::${server.url}/${database.name_client}::error: ${error}`
        );
      }
      console.log("SINCRONIZANDO...", database.description);
    });
});

const app = express();

app.listen(PORT, () => {
  console.log(`O servidor está online: [${HOST}:${PORT}]`);
});
