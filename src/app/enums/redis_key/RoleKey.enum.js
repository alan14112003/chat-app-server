function createKeyEnum(name) {
  return {
    ALL: name + 'all',
    GET: name + 'get',
  }
}

const RoleKeyEnum = createKeyEnum('roles:')

export default RoleKeyEnum
