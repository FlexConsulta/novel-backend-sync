import ServerController from "../controllers/servers.controller";
import DatabasesController from "../controllers/databases.controller";
import LogController from "../controllers/logs.controller";
import { executeSqlLocal } from "./sql.local";
import { executeSqlCustomer } from "./sql.customer";

// todo - ficou definido que nesta primeira verão teremos apenas uma consulta sql, de viagens, poderiormente teremos um cadastro de sql
const sqls = [
  {
    sql: `select count(*) from conhecimento where conhecimento.datadigitacao BETWEEN CURRENT_DATE - '3 days'::interval AND CURRENT_DATE`,
    fieldName: "count",
  },
  {
    sql: `select now() as dataAtual`,
    fieldName: "dataatual",
  },
];

export const syncOneDatabase = async (id_database) => {
  const databases = await DatabasesController.getAllDataBases();
  const servers = await ServerController.getAllServers();

  const database = databases.find((database) => database.id == id_database);
  const server = servers.find((server) => database.id_server == server.id);

  try {
    let status_connection = 200;
    let logDescription = {};

    const {
      value: valueSql0,
      status: statusSql0,
      errorMessage: errorMessageLocal,
    } = await executeSqlLocal(server, database, sqls[0]);

    const { value: valueSql1 } = await executeSqlLocal(
      server,
      database,
      sqls[1]
    );

    logDescription = {
      ...logDescription,
      travelsLocal: valueSql0,
      currentDateLocal: valueSql1,
      errorMessageLocal,
    };

    if (status_connection != 500) status_connection = statusSql0;

    const {
      value: valueCustomerSql0,
      status: statusCustomer,
      errorMessage: errorMessageCustomer,
    } = await executeSqlCustomer(database, sqls[0]);

    const { value: valueCustomerSql1 } = await executeSqlCustomer(
      database,
      sqls[1]
    );

    logDescription = {
      ...logDescription,
      travelsCustomer: valueCustomerSql0,
      currentDateCustomer: valueCustomerSql1,
      errorMessageCustomer,
    };

    if (status_connection != 500) status_connection = statusCustomer;

    const logData = {
      description: JSON.stringify(logDescription),
      id_database: database.id,
      status_connection,
    };

    // console.log(logData);

    await LogController.createLog(logData);
    return logData;
  } catch (error) {
    const logData = {
      description: JSON.stringify({
        ...logDescription,
      }),
      globalErrorMessage: error?.message,
      id_database: database.id,
      status_connection: 500,
    };
    await LogController.createLog(logData);

    return logData;

    // console.log(
    //   `database:::${server.url}/${database.name_client}::error: ${error}`
    // );
  }
  console.log(
    "SINCRONIZANDO...",
    new Date().toLocaleString("pt-BR"),
    database.description
  );
};
