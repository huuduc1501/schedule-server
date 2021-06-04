const { Sequelize } = require('sequelize')

const UserModel = require('./models/User')
const ClassModel = require('./models/Class')
const RoomModel = require('./models/Room')
const ClusterModel = require('./models/Cluster')

console.log(process.env.DATABASE_URL)
const sequelize = new Sequelize('postgres://postgres:42717294@localhost:5432/schedule', {
    logging: false,
});

(async () => sequelize.sync({ force: true }))()



const User = UserModel(sequelize)
const Classes = ClassModel(sequelize)
const Room = RoomModel(sequelize)
const Cluster = ClusterModel(sequelize)

User.hasMany(Cluster, { foreignKey: 'userId' })
Cluster.hasMany(Room, { foreignKey: 'clusterId' })
Room.hasMany(Classes, { foreignKey: 'roomId' })



module.exports = { User, Cluster, Classes, Room }