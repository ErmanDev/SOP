const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.js');


    const UserRoles = sequelize.define('UserRoles', {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'user_roles',
      timestamps: false,
    });
  
   
    UserRoles.sync().then(async () => {
      const roles = [
        { role_id: 1, role_name: 'admin' },
        { role_id: 2, role_name: 'manager' },

      ];
  
      for (const role of roles) {
        await UserRoles.findOrCreate({
          where: { role_id: role.role_id },
          defaults: role
        });
      }
    }).catch((error) => {
      console.error("Error initializing roles:", error);
    });
  
  
  module.exports = UserRoles;


  