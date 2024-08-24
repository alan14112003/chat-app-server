import Joi from 'joi'

const LoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export default LoginValidator
