const bcrypt = require('bcrypt')
const createError = require('http-errors')
const { encryptPassword }   = require("../../../helpers/encrypt-password")
const validateAuth = require("../../../helpers/validate-auth")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../helpers/jwt-helper')
const User = require("../../../models/User")
const { authSchema, userUpdateSchema } = require('../../../helpers/validation-schema')

module.exports = {
    Mutation: {
        userLogin: async (_parent, { input }, { res } , _info) => {
            // validate request user input with Joi
            const result = await authSchema.validateAsync(input)
            if (!result) return createError(400, 'Email and password are required.')
            
            // find user
            const foundUser = await User.findOne({ email: result.email }).exec()
            if (!foundUser) return createError(401, 'Email or password is incorrect.')                        
            
            // evaluate password
             const match = await bcrypt.compare(result.password, foundUser.password)
             if(match){
                 // create JWTs
                 const accessToken = await signAccessToken(foundUser.email)
                 const refreshToken = await signRefreshToken(foundUser.email)

                // update refreshToken and last login date
                await User.findByIdAndUpdate(foundUser.id, {
                    refreshToken,
                    lastLogin: Date.now()
                }, {
                    new: true
                })
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7 // 1 week
                })

                return {
                    id: foundUser.id,
                    lastLogin: foundUser.lastLogin,
                    accessToken
                }
             }else {
                return createError(401, 'Email or password is incorrect.' )
             }
        },
        registerUser: async (_parent, { input }, { res }, _info) => {
            // Validate request user input with Joi
            const result = await authSchema.validateAsync(input)
            if (!result) return createError(400, 'Email and password are required.')
            
            // check for conflit || existing email in the database
            const exist = await User.findOne({ email: result.email }).exec()
            if(exist) return createError(409, 'This user already exist in our database') // Conflict
            try {
                // create JWTs
                const accessToken = await signAccessToken(result.email)
                const refreshToken = await signRefreshToken(result.email)

                // encrypt the password
                const hashedPassword = await encryptPassword(result.password)
        
                // save user to database
                const newUser = new User({ 
                    email: result.email, 
                    password: hashedPassword,
                    refreshToken, 
                    lastLogin: Date.now()
                 })
                await newUser.save()
                
                // refresh token cookie                
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7 // 1 week
                })
            
                return { 
                    id: newUser.id,
                    lastLogin: newUser.lastLogin,
                    accessToken
                 }
            } catch (error) {
                return createError(500, 'Internal server error') // InternalServerError
            }
        },
        updateUser: async (_parent, { id, input }, { req }, _info) => {  
           // Validate request user input with Joi
           const result = await userUpdateSchema.validateAsync(input)
           if (!result) return createError(400, 'Invalid input.')
           
           // destructure result object
           const { name, bio, email, password, phone, photo } = result
            
            // verify cookie
           const cookies = req.cookies
           if(!cookies?.jwt) return createError(401, 'Access is denied due to invalid credentials.') // Unauthorized
           const refreshToken = cookies?.jwt

            const verifiedUserEmail = await validateAuth(req)
            const userEmail = await verifyRefreshToken(refreshToken)
            if(userEmail !== verifiedUserEmail) return createError(403, 'You don\'t have permission to access this resource.')

            // validate user id
            if(!id) return createError(400, 'Invalid user id.')  // BadRequest
            // find user
            const user = await User.findById(id).exec()
            if(!user) return createError(401, 'Access is denied due to invalid credentials.') // Unauthorized
        
            // check if user has enter new password
            if(password){
                // encrypt the new password
                const encryptedPassword = await encryptPassword(password)
                var updateData = { name, bio, email, password: encryptedPassword, phone, photo }
            } else {
                var updateData = { name, bio, email, phone, photo }
            }
            
            // update user
            const userUpdated = await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true })
            return userUpdated
        },
       userLogout: async (_parent, _args, { req, res} , _info) => {
           // verify cookie
           const cookies = req.cookies
           if(!cookies?.jwt) return createError(204) // No content
           const refreshToken = cookies?.jwt
   
           // is refreshToken in db?
           const foundUser = await User.findOne({ refreshToken }).exec()
           if(!foundUser){
              res.cookie('jwt', '', {  maxAge: 0 })
              return
           }
           
           // delete refreshToken in db
           await User.findByIdAndUpdate(foundUser.id, { refreshToken: '' }, { new: true})

          // delete refreshToken cookie in browser
          res.cookie('jwt', '', {  maxAge: 0 })
        },
    }
}