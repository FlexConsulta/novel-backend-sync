import Sequelize from "../index.js";
import { DataTypes } from "sequelize";
import table_server from "./servers.model.js";
import Clients from "./clients.model.js";

const Databases = Sequelize.define(
  "databases",
  {
    id_server: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "servers",
        key: "id",
      },
    },
    id_client: {
      type: DataTypes.INTEGER,
      references: {
        model: "clients",
        key: "id",
      },
    },
    hostname_default: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_default: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_default: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_default: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port_default: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alternative_hostname_client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hostname_client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    port_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_connection: {
      type: DataTypes.STRING,
    },
    schemabd_default: {
      type: DataTypes.STRING,
    },
    schemabd: {
      type: DataTypes.STRING,
    },
    sincronizacao: {
      type: DataTypes.BOOLEAN,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "databases",
  }
);

Databases.associate = () => {
  Databases.belongsTo(Clients, { foreignKey: "id_client", targetKey: "id" });
  Databases.belongsTo(table_server, {
    constraint: true,
    allowNull: false,
    foreignKey: "id_server",
  });
};

export default Databases;
