import { Sequelize } from "sequelize";

const syncDatabase = (
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  DB_LOGGING,
  SCHEMA_NAME
) => {

  console.log({
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    DB_PORT,
    DB_LOGGING,
    SCHEMA_NAME
  });
  
  return new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    define: {
      timestamps: false,
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      statement_timeout: 60000,
      idle_in_transaction_session_timeout: 60000,
      connectTimeout: 60000, // Adicionando timeout de conexão
    },
    schema: SCHEMA_NAME, // Set the schema here
    logging: eval(DB_LOGGING),
  });
};

export default syncDatabase;
