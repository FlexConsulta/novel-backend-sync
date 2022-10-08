import syncDatabase from "./../database/syncSchema";
import { QueryTypes } from "sequelize";

export const executeSqlCustomer = async (database, sql) => {
  try {
    const connection = syncDatabase(
      database.name_client,
      database.user_client,
      database.password_client,
      database.hostname_client,
      "postgres",
      database.port_client,
      false
    );
    const result = await connection.query(sql, {
      type: QueryTypes.SELECT,
    });

    return { value: result[0].count.toString(), status: 200 };
  } catch (error) {
    // console.log(error);
    return { value: "Erro", status: 500 };
  }
};
