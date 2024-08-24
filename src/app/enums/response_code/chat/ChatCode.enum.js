function createCodeEnum(prefix) {
  return {
    errGroupMembers: prefix + 'err_group_members',
  }
}

const ChatCodeEnum = createCodeEnum('chat.')

export default ChatCodeEnum
