import syncDatabase from "./../database/syncSchema";
import { QueryTypes } from "sequelize";

export const executeSqlLocal = async (server, database, sql) => {
  try {
    const connection = syncDatabase(
      database.name_default,
      database.user_default,
      database.password_default,
      server.url,
      "postgres",
      server.port,
      false
    );
    const result = await connection.query(sql, {
      type: QueryTypes.SELECT,
    });

    return { value: result[0].count.toString(), status: 200 };
  } catch (error) {
    console.log(error);
    return { value: "Erro", status: 500 };
  }
};
