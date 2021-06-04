const router = require('express').Router()

const { createClass, createRoom, getSchedule, createCluster } = require('../controllers/schedule')
const { protect } = require('../middlewares/auth')

router.use(protect)
router.route('/cluster').post(createCluster)
router.route('/class/:clusterId').post(createClass)
router.route('/room/:clusterId').post(createRoom)
router.route('/:clusterId').get(getSchedule)

module.exports = router