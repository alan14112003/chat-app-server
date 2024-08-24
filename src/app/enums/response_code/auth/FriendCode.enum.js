function createCodeEnum(prefix) {
  return {
    errConnected: prefix + 'err_connected',
    errRequested: prefix + 'err_requested',
    errNoRequested: prefix + 'err_no_requested',
  }
}

const FriendCodeEnum = createCodeEnum('friend.')

export default FriendCodeEnum
