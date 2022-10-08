import Models from "../database/schemas/default";
import TableClients from "../database/models/clients.model";
import TableUsers from "../database/models/users.model";
import Emails_Clients from "../database/models/emails.model";
import telefone_clients from "../database/models/telefones.model";
import Telefones_Clients from "../database/models/telefones.model";
import { Op } from "sequelize";

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const { page, paginate, razaosocial, cnpj, sincronizacao, name } =
      req.query;

    let filter = [];

    if (name) filter = [{ name: { [Op.like]: `%${name}%` } }];
    if (razaosocial)
      filter = [...filter, { razaosocial: { [Op.like]: `%${razaosocial}%` } }];
    if (cnpj) filter = [...filter, { cnpj: { [Op.like]: `%${cnpj}%` } }];
    if (sincronizacao) filter = [...filter, { sincronizacao }];

    const data = await Models.getAll({
      page,
      paginate,
      filter,
      model: TableClients,
      sort: [["name", "asc"]],
    });

    const dataActive = await Models.getAll({
      page,
      paginate,
      filter: [{ sincronizacao: true }],
      model: TableClients,
      sort: [["name", "asc"]],
    });

    res.status(!data ? 404 : 200);
    res.send({ ...data, totalActiveRecords: dataActive.total });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;
    id = Number(id);
    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({
      pk: id,
      model: TableClients,
      filter: { id },
      include: [Emails_Clients, Telefones_Clients],
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum cliente foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(400);
    const { cnpj } = req.body;
    let rsltClient = await Models.getOne({
      model: TableClients,
      filter: { cnpj },
      attributes: ["id"],
    });

    if (rsltClient) {
      res.status(409);
      throw new Error("Esse cliente já existe");
    }

    const data = await Models.createOne({
      model: TableClients,
      data: req.body,
      include: [Emails_Clients, telefone_clients],
    });

    /* email?.forEach(async (element) => {
      await Models.createOne({
        model:TableEmail,
        data: {client_id:data.id, email: element},
        
      })
    });*/

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    const { id } = req.params;

    let rsltContensCliente = await Models.getOne({
      model: TableClients,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensCliente) {
      res.status(404);
      throw new Error("Cliente não encontrado");
    }

    const { cnpj, email } = req.body;
    if (cnpj) {
      let rsltClient = await Models.getOne({
        model: TableClients,
        filter: { cnpj },
        attributes: ["id"],
      });

      if (rsltClient && rsltClient.id !== Number(id)) {
        res.status(409);
        throw new Error("Esse cliente já existe");
      }
    }

    const data = await Models.updateOne({
      model: TableClients,
      data: req.body,
      filter: { id },
      include: Emails_Clients,
    });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    res.status(400);

    const { id } = req.params;

    let rsltContensCliente = await Models.getOne({
      model: TableClients,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensCliente) {
      res.status(404);
      throw new Error("Cliente não encontrado");
    }

    let hasUserClient = await Models.getOne({
      model: TableUsers,
      filter: { id_client: id },
      attributes: ["id"],
    });

    if (hasUserClient) {
      res.status(500);
      throw new Error(
        "Não foi possível excluir a empresa, pois possui dependência(s)"
      );
    }

    await Models.deleteOne({
      model: TableClients,
      filter: { id },
    });

    res.status(200);
    res.send({ id });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getOne, create, update, deleteOne };
