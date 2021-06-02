
const { Classes, Room, User, Cluster } = require('../configDb')
const asyncHandler = require('../middlewares/asyncHandler')

exports.createCluster = asyncHandler(async (req, res, next) => {
    const { id: userId } = req.user
    const cluster = await Cluster.create(req.body)
    cluster.userId = userId
    await cluster.save()
    res.status(200).json({ success: true, data: cluster })
})

exports.createRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.create(req.body)
    await room.save()
    res.status(200).json({ success: true, data: {} })
})

exports.createClass = asyncHandler(async (req, res, next) => {
    const classes = await Classes.create(req.body)
    // classes.beginDay = new Date(classes.beginDay)
    // classes.finishDay = new Date(classes.finishDay)
    await classes.save()
    res.status(200).json({ success: true, data: {} })
})


exports.getSchedule = asyncHandler(async (req, res, next) => {
    // const { id: userId } = req.user


    const { clusterId } = req.body

    if (!clusterId)
        return next({
            message: 'Vui lòng kiểm tra lại thông tin!',
            statusCode: 400,
        })
    const cluster = await Cluster.findByPk(clusterId)

    const roomList = await Room.findAll({
        where: {
            clusterId
        }
    })
    if (!roomList.length)
        return res.status(200).json({ success: true, data: roomList })

    roomList.forEach(async (room, index) => {
        const classList = await Classes.findAll({
            where: {
                roomId: room.id
            },
            attributes: [
                'id',
                'name',
                'roomType',
                'dayType',
                'beginDay',
                'learnDay',
                'finishDay',
                'numberOfpupils',
                'createdAt',
                'roomId'
            ],
            order: [['createdAt']]
        })
        room.setDataValue("classList", classList)
        if (index === roomList.length - 1) {
            cluster.setDataValue('roomList', roomList)
            return res.status(200).json({ success: true, data: cluster })

        }
    })
})

