const rateLimit = require('express-rate-limit')

const userSrv_Lmter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP for the User Service. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    userSrv_Lmter
}

