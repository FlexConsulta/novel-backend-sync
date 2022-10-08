const schemasDatabases = require('../app/database/schemas/default');
const ModelClients = require('../app/database/models/clients.model');

describe('[>] MODULE CLIENTS', () => {
      test('[i] Create client', async () => {

            const Clients = await schemasDatabases.createOne({
                  model: ModelClients, data: {
                        name: "Geraldo e Mariah Esportes Ltda",
                        email: "posvenda@geraldoemariahesportesltda.com.br",
                        cnpj: "39.308.576/0001-56",
                        phone: "(16) 2788-0406",
                        logo: "www.geraldoemariahesportesltda.com.br",
                  }
            })

            expect(Clients.dataValues.email).toBe("posvenda@geraldoemariahesportesltda.com.br")
      });

      test('[i] Get one client', async () => {
            const Client = await schemasDatabases.getOne({
                  model: ModelClients, filter: { id: 1 }
            })

            expect(Client.id).toBe(1)
      })

      test('[i] Get all clients', async () => {
            const Client = await schemasDatabases.getAll({
                  model: ModelClients,
            })

            expect(Client.length).toBe(1)
      })

      test('[i] Update client', async () => {
            const data = await schemasDatabases.updateOne({
                  model: ModelClients, filter: { id: 1 }, data: {
                        email: "sac@joseethalesconsultoriafinanceiraltda.com.br",
                  }
            })

            expect(data).toBe(1)

      })

      test('[i] Delete client', async () => {
            const data = await schemasDatabases.deleteOne({
                  model: ModelClients, filter: { id: 1 }
            })

            expect(data).toBe(1)

      })

})