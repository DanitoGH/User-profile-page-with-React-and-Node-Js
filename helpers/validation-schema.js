const Joi = require('joi');

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
})

const userUpdateSchema = Joi.object({
    name:  Joi.string().min(3).max(30).required(),
    bio:   Joi.string().min(10).max(100).required(),
    phone: Joi.string().min(10).allow('').allow(null),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).allow('').allow(null),
    photo: Joi.string().allow('').allow(null),
})

module.exports = {
    authSchema,
    userUpdateSchema
}
