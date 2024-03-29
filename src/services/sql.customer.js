import syncDatabase from "./../database/syncSchema";
import { QueryTypes } from "sequelize";

export const executeSqlCustomer = async (database, qry) => {
  try {
    const {
      name_client,
      user_client,
      password_client,
      hostname_client,
      port_client,
      schemabd
    } = database;

    const connection = syncDatabase(
      name_client,
      user_client,
      password_client,
      hostname_client,
      "postgres",
      port_client,
      false,
      schemabd || 'public',
    );

    let sql = qry.sql
    if(sql.indexOf('#@@@@#') > -1) sql = sql.replaceAll('#@@@@#', database?.schemabd_default || 'public') 

    const result = await connection.query(sql, {
      type: QueryTypes.SELECT,
    });

    let value = null;
    if (qry.fieldName === "dataatual") {
      value = result[0][qry.fieldName]?.toLocaleString("pt-BR");
    } else {
      value = result[0][qry.fieldName]?.toString();
    }

    return { value, status: 200 };
  } catch (error) {
    // console.error("erro ao consultar banco do cliente:", error);
    return { value: "Erro", status: 500, errorMessage: error?.message };
  }
};
