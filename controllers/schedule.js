
const { Op } = require('sequelize')
const moment = require('moment')

const { Classes, Room, User, Cluster } = require('../configDb')
const asyncHandler = require('../middlewares/asyncHandler')


exports.createCluster = asyncHandler(async (req, res, next) => {
    const { id: userId } = req.user
    const data = req.body
    const cluster = await Cluster.create(data.cluster)
    cluster.userId = userId
    await cluster.save()

    const tmpRoom = []

    const { crList, rList } = setSchedule(data)

    rList.forEach(async (r, index) => {
        let tmp = await Room.create(r)
        tmp.clusterId = cluster.id
        await tmp.save()
        tmpRoom.push(tmp)
        if (rList.length - 1 === index) {
            crList.forEach(async cr => {
                const tmpR = tmpRoom.find(e => e.name === cr.roomName)


                const tmp = await Classes.create(cr)
                tmp.roomId = tmpR.id
                await tmp.save()
            })

        }

    })

    res.status(200).json({ success: true, data: cluster })
})

exports.createRoom = asyncHandler(async (req, res, next) => {
    req.body.full = req.body.even = req.body.odd = Date()
    console.log(req.body)
    const room = await Room.create(req.body)
    room.clusterId = req.params.clusterId

    await room.save()
    res.status(200).json({ success: true, data: room })
})

exports.createClass = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const rList = await Room.findAll({ where: { clusterId: req.params.clusterId } })
    const { cr, choosen: r } = addClass(req.body, rList)
    const c = await Classes.create(cr)
    await c.save()
    // await Room.update({ values: { even: r.even, odd: r.even, full: r.full }, where: { id: r.id },  attributes: ['even', 'odd', 'full'] })
    console.log(r)
    await Room.update({ even: r.even, odd: r.even, full: r.full }, { where: { id: r.id } })

    // classes.beginDay = new Date(classes.beginDay)
    // classes.finishDay = new Date(classes.finishDay)
    await c.save()
    res.status(200).json({ success: true, data: c })
})


exports.getSchedule = asyncHandler(async (req, res, next) => {
    // const { id: userId } = req.user


    const clusterId = req.params.clusterId

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
                'numberOfPupils',
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



const setSchedule = ({ cluster, classroomList = [], roomList = [] }) => {
    let crList = [...classroomList]
    let rList = [...roomList]

    // set priority
    crList.map(cr => {
        cr.priority = (cr.numberOfPupils * (cr.dayType === 'full' ? 6 : 3) / cr.learnDay)
        return cr
    }).sort((a, b) => b.priority - a.priority)


    // set status day
    rList.map(r => {
        r.odd = r.even = r.full = cluster.beginDay
        return r
    }).sort((a, b) => a.maxPupils - b.maxPupils)

    // // filter big classroom
    // let bigCr = crList.filter(cr => cr.numberOfPupils > 30).sort((a, b) => b.priority - a.priority)

    // // filter small classroom
    // let smallCr = crList.filter(cr => cr.numberOfPupils <= 30).sort((a, b) => b.priority - a.priority)

    // // filter big room
    // let bigR = rList.filter(r => r.maxPupils > 30)

    // // handle big classroom with big room
    // handler(bigCr, bigR)

    // // priority for small room
    // let smallPriorityRoom = rList.sort((a, b) => a.maxPupils === 30 ? -1 : 1)

    // // handle small room with priority small room
    // handler(smallCr, smallPriorityRoom)
    handler(crList, rList)
    return { crList, rList }
}
const handler = (classroomList = [], roomList = []) => {

    //  with begin day add toggle learn day == finish day


    // handle attach room to class room
    classroomList.forEach(cr => {
        let choosen = {}
        roomList.forEach(r => {

            if (r.roomType === cr.roomType && r.maxPupils >= cr.numberOfPupils) {
                if (Object.keys(choosen).length === 0) {
                    choosen = r
                }
                // console.log(compareDate(r[cr.dayType], choosen[cr.dayType]))
                if (compareDate(choosen[cr.dayType], r[cr.dayType]))
                    choosen = r
            }
        })
        cr.beginDay = choosen[cr.dayType]
        cr.finishDay = addDate(cr.beginDay, totalDay(cr.beginDay, cr.dayType, cr.learnDay)).toLocaleDateString()

        cr.roomName = choosen.name

        if (cr.dayType === 'full') {
            choosen.full = cr.finishDay
            choosen.even = cr.finishDay
            choosen.odd = cr.finishDay
        } else {
            choosen[cr.dayType] = cr.finishDay
            choosen['full'] = cr.finishDay
        }
    })
}

const addClass = (cr, roomList) => {

    let choosen = {}
    roomList.forEach(r => {

        if (r.roomType === cr.roomType && r.maxPupils >= cr.numberOfPupils) {
            if (Object.keys(choosen).length === 0) {
                choosen = r
            }
            // console.log(compareDate(r[cr.dayType], choosen[cr.dayType]))
            if (compareDate(choosen[cr.dayType], r[cr.dayType]))
                choosen = r
        }
    })
    cr.beginDay = choosen[cr.dayType]
    cr.finishDay = addDate(cr.beginDay, totalDay(cr.beginDay, cr.dayType, cr.learnDay)).toLocaleDateString()

    cr.roomId = choosen.id

    if (cr.dayType === 'full') {
        choosen.full = cr.finishDay
        choosen.even = cr.finishDay
        choosen.odd = cr.finishDay
    } else {
        choosen[cr.dayType] = cr.finishDay
        choosen['full'] = cr.finishDay
    }
    return { cr, choosen }
}

const addDate = (date, number) => {

    let d = new Date(date)
    return new Date(d.setDate(d.getDate() + number))
}

// compute total day by learn day
const totalDay = (date, type, number) => {
    let d = new Date(date)
    let bonus = 1
    if (type === 'odd' && d.getDay() % 2 === 1)
        bonus += 1
    if (type === 'even') {
        if (d.getDay() === 6) {
            bonus += 2
        }
        else {
            if (d.getDay() % 2 === 0 && d.getDay() !== 0)
                bonus += 1
        }
    }

    if (d.getDay() === 0)
        bonus += 1
    return type === 'full'
        ? Math.floor(number / 6) * 7 + number % 6 + bonus
        : Math.floor(number / 3) * 7 + (number % 3) * 2 + bonus
}
const compareDate = (day1, day2) => {
    const d1 = new Date(day1)
    const d2 = new Date(day2)
    return d1.getTime() - d2.getTime()
}