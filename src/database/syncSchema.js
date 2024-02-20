import { Sequelize } from "sequelize";

const syncDatabase = (
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  DB_LOGGING
) => {
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
      statement_timeout: 15000,
      idle_in_transaction_session_timeout: 15000,
      connectTimeout: 15000, // Adicionando timeout de conexão
    },
    logging: eval(DB_LOGGING),
  });
};

export default syncDatabase;
