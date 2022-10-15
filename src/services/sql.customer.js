import syncDatabase from "./../database/syncSchema";
import { QueryTypes } from "sequelize";

export const executeSqlCustomer = async (database, qry) => {
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
    const result = await connection.query(qry.sql, {
      type: QueryTypes.SELECT,
    });

    let value;
    if (qry.fieldName === "dataatual") {
      value = result[0][qry.fieldName]?.toLocaleString("pt-BR");
    } else {
      value = result[0][qry.fieldName]?.toString();
    }

    return { value, status: 200 };
  } catch (error) {
    return { value: "Erro", status: 500, errorMessage: error?.message };
  }
};
