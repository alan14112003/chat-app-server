import Joi from 'joi'

const FriendAcceptValidator = Joi.object({
  userFrom: Joi.string(),
})

export default FriendAcceptValidator
