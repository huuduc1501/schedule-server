const router = require('express').Router()

const { createClass, createRoom, getSchedule } = require('../controllers/schedule')
const { protect } = require('../middlewares/auth')

router.use(protect)
router.route('/createClass').post(createClass)
router.route('/createRoom').post(createRoom)
router.route('/getSchedule').get(getSchedule)

module.exports = router