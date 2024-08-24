import Joi from 'joi'

const ChangeNicknameValidator = Joi.object({
  userId: Joi.string().required(),
  nickname: Joi.string().required(),
})

export default ChangeNicknameValidator
