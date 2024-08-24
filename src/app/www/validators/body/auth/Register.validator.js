import UserGenderEnum from '@/app/enums/user/UserGender.enum'
import Joi from 'joi'

const RegisterValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  gender: Joi.number()
    .required()
    .integer()
    .valid(...Object.keys(UserGenderEnum.allName()).map((k) => Number(k))),
})

export default RegisterValidator
