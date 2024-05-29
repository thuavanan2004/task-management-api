const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const loginValidate = (dataLogin) => {
    return loginSchema.validate(dataLogin);
}

module.exports = loginValidate;