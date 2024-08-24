import Joi from 'joi'

const FriendAddValidator = Joi.object({
  userTo: Joi.string(),
})

export default FriendAddValidator
