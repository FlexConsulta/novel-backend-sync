const schemasDatabases = require('../app/database/schemas/default');
const ModelServers = require('../app/database/models/servers.model');

describe('[>] MODULE SERVERS', () => {
      test('[i] Create server', async () => {

            const Servers = await schemasDatabases.createOne({
                  model: ModelServers, data: {
                        name: "Servidor principal",
                        url: "192.168.10.7",
                  }
            })

            expect(Servers.dataValues.id).toBe(1)
      });

      test('[i] Get one server', async () => {
            const Server = await schemasDatabases.getOne({
                  model: ModelServers, filter: { id: 1 }
            })

            expect(Server.id).toBe(1)
      })

      test('[i] Get all servers', async () => {
            const Server = await schemasDatabases.getAll({
                  model: ModelServers,
            })

            expect(Server.length).toBe(2)
      })

      test('[i] Update server', async () => {
            const data = await schemasDatabases.updateOne({
                  model: ModelServers, filter: { id: 1 }, data: {
                        url: "192.168.10.10",
                  }
            })

            expect(data).toBe(1)

      })

      test('[i] Delete server', async () => {
            const data = await schemasDatabases.deleteOne({
                  model: ModelServers, filter: { id: 1 }
            })

            expect(data).toBe(1)

      })

})