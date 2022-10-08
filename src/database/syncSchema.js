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
  const sequelizeModel = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    define: {
      timestamps: false,
      underscored: true,
      underscoredAll: true,
    },
    // dialectOptions: {
    //   statement_timeout: 3000,
    //   idle_in_transaction_session_timeout: 3000,
    // },
    logging: eval(DB_LOGGING),
  });

  return sequelizeModel;
};

export default syncDatabase;
