import { configDotenv } from 'dotenv'

configDotenv()
const nodeEnv = process.env.NODE_ENV

const ValidatorMiddleware = {
  validateBody(schema) {
    return (req, res, next) => {
      const validateResult = schema.validate(req.body)

      if (!validateResult.error) {
        return next()
      }

      let error = validateResult.error

      if (nodeEnv === 'production') {
        error = validateResult.error.details[0].message
      }

      return res.status(422).json({
        message: error,
      })
    }
  },
}

export default ValidatorMiddleware
