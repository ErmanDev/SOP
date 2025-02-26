const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.js');

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    suffix: {
        type: DataTypes.ENUM('jr', 'sr', 'ii', 'iii', 'iv'),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.ENUM('hr', 'manager', 'technician'),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'user_roles',
            key: 'role_id'
        }
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;
