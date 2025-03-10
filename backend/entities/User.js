const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize.js");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    suffix: {
      type: DataTypes.ENUM("jr", "sr", "ii", "iii", "iv"),
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.ENUM("hr", "manager", "technician"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
    },
    team: {
      type: DataTypes.ENUM("north", "south"), // ✅ Fixed ENUM formatting
      allowNull: true,
    },
    profile_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://grammedia-vids.s3.ap-southeast-2.amazonaws.com/boy.png",
    },
   
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    allowance: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, 
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
