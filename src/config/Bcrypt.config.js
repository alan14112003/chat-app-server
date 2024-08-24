import bcryptJs from 'bcryptjs'

const salt = bcryptJs.genSaltSync(10)

const BcryptConfig = {
  hashPass(value) {
    return bcryptJs.hashSync(value, salt)
  },

  comparePass(value, hash) {
    return bcryptJs.compareSync(value, hash)
  },
}

export default BcryptConfig
