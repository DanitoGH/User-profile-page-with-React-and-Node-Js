const bcrypt = require('bcrypt')
const createError = require('http-errors')

module.exports = {
    encryptPassword: async (password) => {
            try {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                return hashedPassword
            } catch (error) {
                return createError(500, 'Internal server error.')
            }
   }
}