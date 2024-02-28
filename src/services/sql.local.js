import syncDatabase from "./../database/syncSchema";
import { QueryTypes } from "sequelize";

export const executeSqlLocal = async (server, database, qry) => {
  try {

    const connection = syncDatabase(
      database.name_default,
      database.user_default,
      database.password_default,
      server.url,
      "postgres",
      server.port,
      false,
      database?.schemabd_default || 'public',
    );

    let sql = qry.sql
    if (sql.indexOf('#@@@@#') > -1) sql = sql.replaceAll('#@@@@#', database?.schemabd_default || 'public')

    const result = await connection.query(sql, {
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
    // console.log(error);
    return { value: "Erro", status: 500, errorMessage: error?.message };
  }
};
