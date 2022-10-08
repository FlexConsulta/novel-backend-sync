import Models from "../database/schemas/default";
import TableLogs from "../database/models/logs.model";
import TableDatabase from "../database/models/databases.model";
import { Sequelize } from "sequelize";

const getAll = async (req, res, next) => {
  try {
    res.status(400);
    const data = await Models.getAll({
      model: TableLogs,
    });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(400);

    let { id_database } = req.body;

    const obj = { id: id_database };
    let rsltDatabase = await Models.getOne({
      model: TableDatabase,
      filter: obj.id,
      attributes: ["id"],
    });

    if (!rsltDatabase) {
      res.status(404);
      throw new Error("Database não encontrada");
    }

    const data = await Models.createOne({ model: TableLogs, data: req.body });

    res.status(200);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    res.status(400);

    let { id } = req.params;

    if (isNaN(id)) throw new Error("O formato do ID está incorreto!");

    const data = await Models.getOne({ model: TableLogs, filter: { id } });

    res.status(!data ? 404 : 200);
    res.send(data || "Nenhum Log foi encontrado!");
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(400);
    let { id } = req.params;

    let rsltContensLogs = await Models.getOne({
      model: TableLogs,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltContensLogs) {
      res.status(404);
      throw new Error("Log não encontrado");
    }

    let { id_database } = req.body;

    if (id_database) {
      const obj = { id: id_database };
      let rsltDatabase = await Models.getOne({
        model: TableDatabase,
        filter: obj.id,
        attributes: ["id"],
      });

      if (!rsltDatabase) {
        res.status(404);
        throw new Error("Banco de Dados não encontrado");
      }
    }

    req.body["updated_at"] = Sequelize.fn("NOW");
    const data = await Models.updateOne({
      model: TableLogs,
      data: req.body,
      filter: { id },
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

    let rsltLog = await Models.getOne({
      model: TableLogs,
      filter: { id },
      attributes: ["id"],
    });

    if (!rsltLog) {
      res.status(404);
      throw new Error("Log não encontrado");
    }

    await Models.deleteOne({
      model: TableLogs,
      filter: { id },
    });
    res.status(200);
    res.send(id);
  } catch (error) {
    next(error);
  }
};

export default { getAll, create, getOne, update, deleteOne };
