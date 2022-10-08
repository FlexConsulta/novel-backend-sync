import fs from "fs";
import path from "path";
import tableClients from "./models/clients.model";
import tableProfiles from "./models/profiles.model";
import tablePersons from "./models/persons.model";
import tableUsers from "./models/users.model";
import tableServers from "./models/servers.model";
import tableDatabases from "./models/databases.model";
import tableLogs from "./models/logs.model";
import tableViewDatabases from "./models/views.databases.model";
import TableEmails from "./models/emails.model";
import TablePhone from "./models/telefones.model";


(async () => {
  Promise.all([
    await tableClients.drop({ force: true }),
    await tableProfiles.drop({ force: true }),
    await tablePersons.drop({ force: true }),
    await tableUsers.drop({ force: true }),
    await tableServers.drop({ force: true }),
    await tableDatabases.drop({ force: true }),
    await tableLogs.drop({ force: true }),
    await tableViewDatabases.drop({ force: true }),
    await TableEmails.drop({ force:true }),
    await TablePhone.sync({ force: true }),

  ])
    .then(async () => {
      if (process.env.NODE_ENV == "test") {
        fs.rmSync(
          path.resolve(
            __dirname,
            "..",
            "..",
            "__tests__",
            "database",
            "database.sqlite"
          ),
          {
            maxRetries: 5,
            retryDelay: 200,
            recursive: true,
            force: true,
          }
        );

        console.log("[>] Limpeza do banco de dados concluído.");
      }
    })
    .catch((err) => console.log({ err }));
})();
