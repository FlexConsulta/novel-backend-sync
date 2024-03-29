import ServerController from "./../controllers/servers.controller";
import DatabasesController from "./../controllers/databases.controller";
import LogController from "./../controllers/logs.controller";
import { executeSqlLocal } from "./../services/sql.local";
import { executeSqlCustomer } from "./../services/sql.customer";
let cronIsRunning = false

// todo - ficou definido que nesta primeira verão teremos apenas uma consulta sql, de viagens, poderiormente teremos um cadastro de sql
const sqls = [
      {
            sql: `select count(*) from #@@@@#.conhecimento where #@@@@#.conhecimento.datadigitacao BETWEEN CURRENT_DATE - '3 days'::interval AND CURRENT_DATE`,
            fieldName: "count",
      },
      {
            sql: `SELECT NOW() AT TIME ZONE 'America/Cuiaba' AS dataAtual;`,
            fieldName: "dataatual",
      },
      {
            sql: `SELECT max(#@@@@#.conhecimento.numero) FROM #@@@@#.conhecimento where #@@@@#.conhecimento.data > CURRENT_DATE - '1 days'::interval`,
            fieldName: "max",
      },
      {
            sql: `SELECT max(#@@@@#.nota.codnota) FROM #@@@@#.nota where #@@@@#.nota.datadigitacao > CURRENT_DATE - '1 days'::interval`,
            fieldName: "max",
      },
];





export const syncAllDatabase = async (recursive) => {
      try {

            const numGroup = new Date().valueOf() 

            const servers = await ServerController.getAllServers();
            const databases = await DatabasesController.getAllDataBases();

            console.log("servers:", servers.length);
            console.log("databases:", databases.length);

            const serversSorted = servers.sort((a, b) => a.name - b.name);

            const customLoopServers = async (idxServer) => {
                  const server = serversSorted[idxServer];
                  if (!server) return;

                  console.log(" -> ", server.name, "");

                  const customLoopDatabases = async (idxDatabase) => {
                        try {
                              const dataBasesFiltered = databases.filter(
                                    (db) => db.id_server === server.id
                              );

                              if (!dataBasesFiltered.length > 0) return;

                              const database = dataBasesFiltered[idxDatabase];

                              if (!database) return;

                              console.log("   -> ", database.name_default);

                              let status_connection = 200;
                              let logDescription = {};

                              const {
                                    value: valueSql0,
                                    status: statusSql0,
                                    errorMessage: errorMessageLocal,
                              } = await executeSqlLocal(server, database, sqls[0]);
                              console.log("executeSqlLocal 0");
                              const { value: valueSql1 } = await executeSqlLocal(
                                    server,
                                    database,
                                    sqls[1]
                              );
                              console.log("executeSqlLocal 1");
                              const { value: valueSqlMaxCteToDay } = await executeSqlLocal(
                                    server,
                                    database,
                                    sqls[2]
                              );
                              console.log("executeSqlLocal 2");
                              const { value: valueSqlMaxInvoiceToDay } = await executeSqlLocal(
                                    server,
                                    database,
                                    sqls[3]
                              );

                              logDescription = {
                                    ...logDescription,
                                    travelsLocal: valueSql0,
                                    currentDateLocal: valueSql1,
                                    max_invoice_today: valueSqlMaxInvoiceToDay,
                                    max_cte_today: valueSqlMaxCteToDay,
                                    errorMessageLocal,
                              };

                              if (status_connection != 500) status_connection = statusSql0;

                              console.log("executeSqlCustomer 0");
                              const {
                                    value: valueCustomerSql0,
                                    status: statusCustomer,
                                    errorMessage: errorMessageCustomer,
                              } = await executeSqlCustomer(database, sqls[0]);

                              console.log("executeSqlCustomer 1");
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
                                    group: numGroup
                              };


                              await LogController.createLog(logData);

                              await customLoopDatabases(idxDatabase + 1);
                        } catch (error) {
                              console.log("error::", error);
                              const logData = {
                                    description: JSON.stringify({
                                          ...logDescription,
                                    }),
                                    globalErrorMessage: error?.message,
                                    id_database: database.id,
                                    status_connection: 500,
                              };
                              await LogController.createLog(logData);

                              await customLoopDatabases(idxDatabase + 1);
                        }
                  };
                  await customLoopDatabases(0);

                  await customLoopServers(idxServer + 1);
            };
            await customLoopServers(0);
            console.log("FINALIZADA CRON IMPORT DATABASE");
            return true
            
            
      } catch (error) {
            cronIsRunning = false
      }
};
