module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middle_initial: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
     
      userTypes: {
        type: Sequelize.STRING,
        allowNull: true,
       defaultValue: 'employee'
      },
      contact_number: {
        type: Sequelize.STRING,
      },
      position:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
      },
      suffix: {
        type: Sequelize.STRING,
        allowNull: true, 
        defaultValue: 'N/A', 
      },
      gender: {
        type: Sequelize.STRING,
      },
      profile_img: {
        type: Sequelize.TEXT,
        allowNull: true,
 
      },
    }, {
      tableName: 'User',
      timestamps: false,
    });
  
    return User; 
};