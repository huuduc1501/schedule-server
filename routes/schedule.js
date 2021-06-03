const router = require('express').Router()

const { createClass, createRoom, getSchedule, createCluster } = require('../controllers/schedule')
const { protect } = require('../middlewares/auth')

router.use(protect)
router.route('/cluster').post(createCluster)
router.route('/class').post(createClass)
router.route('/room').post(createRoom)
router.route('/:clusterId').get(getSchedule)

module.exports = router