import Models from "../database/schemas/default";
import TableServers from "../database/models/servers.model";

const getAllServers = async () => {
  try {
    const dataActive = await Models.getAll({
      filter: [{ ativo: true }],
      model: TableServers,
    });

    return dataActive;
  } catch (error) {
    console.log(error);
  }
};

export default { getAllServers };
