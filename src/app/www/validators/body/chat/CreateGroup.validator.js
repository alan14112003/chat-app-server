import Joi from 'joi'

const CreateGroupValidator = Joi.object({
  groupName: Joi.string().required(),
  members: Joi.array().items(Joi.string()).required(),
})

export default CreateGroupValidator
