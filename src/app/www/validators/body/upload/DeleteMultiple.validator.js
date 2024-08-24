import Joi from 'joi'

const UploadDeleteMultipleValidator = Joi.object({
  paths: Joi.array().required().items(Joi.string().required()),
})

export default UploadDeleteMultipleValidator
