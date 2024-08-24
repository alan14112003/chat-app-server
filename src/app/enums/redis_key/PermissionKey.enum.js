function createKeyEnum(name) {
  return {
    ALL: name + 'all',
    GET: name + 'get',
  }
}

const PermissionKeyEnum = createKeyEnum('permissions:')

export default PermissionKeyEnum
