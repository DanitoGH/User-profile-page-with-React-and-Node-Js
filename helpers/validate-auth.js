const jwt = require("jsonwebtoken")
const createError = require('http-errors')

module.exports = async (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return createError(401, 'Access is denied due to invalid credentials.') // Unauthorized
    const token = authHeader.split("Bearer ")[1]

    const user = jwt.verify( 
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, payload) => {
            if (err || payload.iss !== process.env.BASE_URL || payload.aud !== process.env.JWT_AUDIENCE){
                return createError(403, 'Invalid/expired token!') // Forbidden
            } 
            return payload.email
        })
    return user
}