import sequelize from "../index.js";
import { DataTypes, Sequelize } from "sequelize";

const Logs = sequelize.define(
  "logs",
  {
    id_database: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "databases",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_connection: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "logs",
  }
);

Logs.associate = (model) => {
  Logs.belongsTo(model.databases, {
    foreignKey: "id_database",
    as: "database",
  });
};

export default Logs;
