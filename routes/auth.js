const router = require('express').Router()

const { login, signup, getMe } = require('../controllers/auth')
const { protect } = require('../middlewares/auth')

router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/getMe').get(protect, getMe)

module.exports = router