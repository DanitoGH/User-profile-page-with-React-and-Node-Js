const createError = require('http-errors')
const validateAuth = require("../../../helpers/validate-auth")
const { signAccessToken, verifyRefreshToken } = require('../../../helpers/jwt-helper')
const User = require("../../../models/User")

module.exports = {
    Query: {
        getUser: async (_parent, { id }, { req } , _info) => {
            const user = await validateAuth(req)
            if(!user) return createError(401, 'Access is denied due to invalid credentials.')
            
            // validate user id
            if(!id) return createError(400, 'Invalid user id')  // BadRequest

            // find user by id
            const foundUser = await User.findById(id)
            if(!foundUser) return createError(401, 'Access is denied due to invalid credentials.')
            return foundUser
        },
        refreshToken: async (_parent, _args, { req } , _info) => {
            // verify cookie
           const cookies = req.cookies
           if(!cookies?.jwt) return createError(401, 'Access is denied due to invalid credentials.')
           const refreshToken = cookies?.jwt

            // evaluate jwt
            const userEmal = await verifyRefreshToken(refreshToken)
            if(!userEmal) return createError(403, 'You don\'t have permission to access this resource.')
            
            // find user
            const foundUser = await User.findOne({ refreshToken }).exec()
            if(!foundUser) return createError(403, 'You don\'t have permission to access this resource.')
        
            // create new token
            const accessToken = await signAccessToken(userEmal)

            return { 
               id: foundUser.id,
               lastLogin: foundUser.lastLogin,
               accessToken
            }
       },
    },
}