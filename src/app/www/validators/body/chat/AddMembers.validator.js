import Joi from 'joi'

const AddMembersValidator = Joi.object({
  members: Joi.array().items(Joi.string()).required(),
})

export default AddMembersValidator
