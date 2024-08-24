function createKeyEnum(name) {
  return {
    ID: name + 'id',
  }
}

const AuthKeyEnum = createKeyEnum('auth:')

export default AuthKeyEnum
