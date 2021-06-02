const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) =>
    sequelize.define('Room', {
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
        maxPupils: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        roomType: {
            type: DataTypes.ENUM('PM', 'PT'),
            allowNull: false,
        },
        odd: {
            type: DataTypes.DATE,
            allowNull: false
        },
        even: {
            type: DataTypes.DATE,
            allowNull: false
        },
        full: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })