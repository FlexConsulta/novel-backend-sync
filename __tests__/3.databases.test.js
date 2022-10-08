const schemasDatabases = require('../app/database/schemas/default');
const ModelDatabases = require('../app/database/models/databases.model');
const ModelServers = require('../app/database/models/servers.model');


describe('[>] MODULE DATABASES', () => {

      test('[i] Create database', async () => {

            const Server = await schemasDatabases.createOne({
                  model: ModelServers, data: {
                        name: "Servidor principal II",
                        url: "192.168.10.12",
                  }
            })

            expect(Server.name).toBe('Servidor principal II')

            const data = await schemasDatabases.createOne({
                  model: ModelDatabases, data: {
                        id_server: Server.id,
                        name_default: 'Database 1',
                        user_default: 'User 1',
                        password_default: 'NewPassword',
                        port_default: 5432,
                        hostname_client: '192.168.1.1',
                        name_client: 'Database 2',
                        user_client: 'User 2',
                        password_client: 'NewPassword',
                        port_client: 5433,
                        status_connection: 'online',
                        description: 'Descrição de novo usuário',
                  }
            })

            expect(data.dataValues.id).toBe(1)
      });


      test('[i] Get one database', async () => {
            const Client = await schemasDatabases.getOne({
                  model: ModelDatabases, filter: { id: 1 }
            })

            expect(Client.id).toBe(1)
      })

      test('[i] Get all databases', async () => {
            const Client = await schemasDatabases.getAll({
                  model: ModelDatabases,
            })

            expect(Client.length).toBe(1)
      })

      test('[i] Update database', async () => {
            const data = await schemasDatabases.updateOne({
                  model: ModelDatabases, filter: { id: 1 }, data: {
                        name_default: 'Database updated III',
                  }
            })

            expect(data).toBe(1)

      })

      test('[i] Delete database', async () => {
            const data = await schemasDatabases.deleteOne({
                  model: ModelDatabases, filter: { id: 1 }
            })

            expect(data).toBe(1)

      })

})



