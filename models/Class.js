const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) =>
    sequelize.define('Class', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        roomType: {
            type: DataTypes.ENUM('PM', 'PT'),
            allowNull: false,
        },
        dayType: {
            type: DataTypes.ENUM('odd', 'even', 'full'),
            allowNull: false,
        },
        beginDay: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        learnDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        finishDay: {
            type: DataTypes.DATE,
            allowNull: false
        },
        numberOfPupils: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })