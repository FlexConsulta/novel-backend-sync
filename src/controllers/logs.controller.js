import Models from "../database/schemas/default";
import TableLogs from "../database/models/logs.model";

const createLog = async (logData) => {
  try {
    await Models.createOne({ model: TableLogs, data: logData });
  } catch (error) {
    console.log("Erro ao criar registro de log de sincronização", error);
  }
};

export default { createLog };
