import Models from "../database/schemas/default";
import TableDatabases from "../database/models/databases.model";

const getAllDataBases = async () => {
  try {
    const dataActive = await Models.getAll({
      filter: [{ sincronizacao: true }],
      model: TableDatabases,
    });

    return dataActive;
  } catch (error) {
    next(error);
  }
};

export default { getAllDataBases };
