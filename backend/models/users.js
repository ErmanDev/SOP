module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User_roles',
          key: 'role_id',
        },
      },
      date_hired: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Full-time', 'Part-time'),
        allowNull: false,
      },
      profile_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'http://api.dicebear.com/7.x/lorelei/svg',
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
    }
  );

  return Users;
};
