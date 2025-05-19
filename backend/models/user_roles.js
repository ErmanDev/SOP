module.exports = (sequelize, Sequelize) => {
  const UserRoles = sequelize.define(
    'UserRoles',
    {
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
    },
    {
      tableName: 'User_roles',
      timestamps: false,
    }
  );

  UserRoles.sync()
    .then(async () => {
      const roles = [
        { role_id: 1, role_name: 'admin' },
        { role_id: 2, role_name: 'employee' },
      ];

      for (const role of roles) {
        await UserRoles.findOrCreate({
          where: { role_id: role.role_id },
          defaults: role,
        });
      }
    })
    .catch((error) => {
      console.error('Error initializing roles:', error);
    });

  return UserRoles;
};
