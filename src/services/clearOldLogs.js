import { QueryTypes } from "sequelize";
import sequelizeModel from "../database";

export const clearOldLogs = async () => {
  const sqlClearLogs = `delete from logs where id in (select id from logs l where l.created_at < CURRENT_DATE - '15 days'::interval )`;

  await sequelizeModel.query(sqlClearLogs, {
    type: QueryTypes.DELETE,
  });

  setTimeout(async () => {
    await clearOldLogs();
  }, 60000 * 60);
};
