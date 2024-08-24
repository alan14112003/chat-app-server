function createCodeEnum(prefix) {
  return {
    success: prefix + 'success',
    notFound: prefix + 'not_found',
    userNotFound: prefix + 'user_not_found',
    created: prefix + 'created',
    serverLocked: prefix + 'server_locked',
    serverError: prefix + 'server_error',
  }
}

const StatusCodeEnum = createCodeEnum('status.')

export default StatusCodeEnum
