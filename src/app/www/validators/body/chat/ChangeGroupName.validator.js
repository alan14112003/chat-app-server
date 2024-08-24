import Joi from 'joi'

const ChangeGroupNameValidator = Joi.object({
  groupName: Joi.string().required(),
})

export default ChangeGroupNameValidator
