import Joi from 'joi'

const RemoveMemberValidator = Joi.object({
  userId: Joi.string().required(),
})

export default RemoveMemberValidator
