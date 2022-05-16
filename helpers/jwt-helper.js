const jwt = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: async (userEmail) => {
        const accessToken = jwt.sign({
             iss: process.env.BASE_URL, // issuer
             aud: process.env.JWT_AUDIENCE,  // audience
             email: userEmail  // payload
            }, 
               process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: '15m'  // expires in 15 minutes
            })
           return accessToken
    },
    signRefreshToken: async (userEmail) => {
        const refreshToken = jwt.sign({
            iss: process.env.BASE_URL, // issuer
            aud: process.env.JWT_AUDIENCE,  // audience
            email: userEmail  // payload
           }, 
              process.env.REFRESH_TOKEN_SECRET, {
              expiresIn: '7d'  // expires in 7 days
           })
          return refreshToken
    },
    verifyRefreshToken: async (refreshToken) => {
        const result = jwt.verify( 
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
                if (err || payload.iss !== process.env.BASE_URL || 
                    payload.aud !== process.env.JWT_AUDIENCE){
                    return createError(401, 'Access is denied due to invalid credentials.') // Forbidden
                }
                return payload.email
            })
        return result
    },

}