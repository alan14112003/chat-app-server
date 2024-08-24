const ValidatorMiddleware = {
  validateBody(schema) {
    return (req, res, next) => {
      const validateResult = schema.validate(req.body)

      if (validateResult.error) {
        return res.status(422).json(validateResult.error)
      }
      next()
    }
  },
}

export default ValidatorMiddleware
