module.exports = function errorHandler(err, req, res, next) {
    let message = err.message || 'Lỗi server'
    let statusCode = err.statusCode || 500

    if (err.name === 'SequelizeValidationError') {
        const fields = err.errors.map(field => field.path)
        message = `Trường ${fields.join(', ')} không được để trống!`
        statusCode = 400
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors.map(field => field.path)[0]
        message = `Trường ${field} đã tồn tại!`
        statusCode = 400
    }

    res.status(statusCode).json({ success: false, message })

}