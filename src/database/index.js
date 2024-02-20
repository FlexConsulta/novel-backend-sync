import "dotenv/config";

const databaseType = process.env.NODE_ENV;
import { Sequelize } from "sequelize";

let sequelizeModel = null;
switch (databaseType) {
  case "test":
    sequelizeModel = new Sequelize({
      dialect: "sqlite",
      storage: "./__tests__/database/database.sqlite",
      logging: false,
    });

    break;

  default:
    const {
      DB_HOST,
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD,
      DB_DIALECT,
      DB_LOGGING,
      DB_PORT,
    } = process.env;

    sequelizeModel = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
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

    break;
}

export default sequelizeModel;
// export default sequelizeModel;
