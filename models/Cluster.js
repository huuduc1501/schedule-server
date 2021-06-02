const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) =>
    sequelize.define('Cluster', {
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
        beginDay: {
            type:DataTypes.DATE,
            allowNull:false,
        }
    })