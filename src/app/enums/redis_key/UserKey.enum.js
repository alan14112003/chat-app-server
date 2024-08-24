function createKeyEnum(name) {
  return {
    ALL: name + 'all',
  }
}

const UserKeyEnum = createKeyEnum('users:')

export default UserKeyEnum
