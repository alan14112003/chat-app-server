import Joi from 'joi'

const ReactionValidator = Joi.object({
  emojiId: Joi.number().required(),
})

export default ReactionValidator
