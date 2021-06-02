const jwt = require('jsonwebtoken')

const { User } = require('../configDb')

exports.protect = async (req, res, next) => {
    if (!req.headers.authorization)
        return next({
            message: 'Bạn cần đăng nhập để truy cập mục này!',
            statusCode: 401,
        })

    const token = req.headers.authorization.replace('Bearer', '').trim()
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decode.id,
            {
                attributes: [
                    'id',
                    'username',
                    'email',
                    'createdAt',
                    'role'
                ]
            })
        if (!user) {
            next({
                message: 'Bạn cần đăng nhập để truy cập mục này!',
                statusCode: 401,
            })
        }
        req.user = user
        next()

    } catch (err) {
        next({
            message: 'Bạn cần đăng nhập để truy cập mục này!',
            statusCode: 401,
        })
    }
}