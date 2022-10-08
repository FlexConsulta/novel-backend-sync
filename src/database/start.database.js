import tableClients from "./models/clients.model.js";
import tableProfiles from "./models/profiles.model.js";
import tablePersons from "./models/persons.model.js";
import tableUsers from "./models/users.model.js";
import tableServers from "./models/servers.model.js";
import tableDatabases from "./models/databases.model.js";
import tableLogs from "./models/logs.model.js";
import tableViewDatabases from "./models/views.databases.model.js";
import TableEmails from "./models/emails.model.js";
import TablePhone from "./models/telefones.model.js";

(async () => {
  Promise.all([
    await tableClients.sync({ force: true }),
    await tableProfiles.sync({ force: true }),
    await tablePersons.sync({ force: true }),
    await tableUsers.sync({ force: true }),
    await tableServers.sync({ force: true }),
    await tableDatabases.sync({ force: true }),
    await tableLogs.sync({ force: true }),
    await tableViewDatabases.sync({ force: true }),
    await TableEmails.sync({ force: true }),
    await TablePhone.sync({ force: true }),

  ])
    .then((data) => console.log("[Running migrations]: ", data))
    .catch((err) => console.log({ err }));
})();
