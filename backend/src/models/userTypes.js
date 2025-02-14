
module.exports = (sequelize, Sequelize) => {
    const UserTypes = sequelize.define('UserTypes', {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,    
      },    
      role_name: {
        type: Sequelize.STRING,    
        allowNull: false,
      },    
    }, {
      tableName: 'UserTypes',
      timestamps: false,
    });
      
   
    UserTypes.sync().then(async () => {
      const roles = [    
        { userType_id: 1, usertTypeName: 'hr' },
        { userType_id: 2, usertTypeName: 'employee' }
      ];
  
      for (const role of roles) {
        await UserTypes.findOrCreate({
          where: { userType_id: role.userType_id },
          defaults: role
        });
      }
    }).catch((error) => {
      console.error("Error initializing roles:", error);
    });
  
    return UserTypes;
  };
  