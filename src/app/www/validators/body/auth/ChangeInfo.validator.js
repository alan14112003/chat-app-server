import UserGenderEnum from '@/app/enums/user/UserGender.enum'
import Joi from 'joi'

const ChangeInfoValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.number()
    .integer()
    .valid(...Object.keys(UserGenderEnum.allName()).map((k) => Number(k))),
})

export default ChangeInfoValidator
