function createEventName(name) {
  return {
    CHANGE_NICKNAME: name + 'change_nickname',
    SEEN_MSG: name + 'seen_msg',
    GROUP_CREATE: name + 'group.create',
    GROUP_CHANGE_NAME: name + 'group.change_name',
    GROUP_ADD: name + 'group.add',
    GROUP_OUT: name + 'group.out',
    GROUP_REMOVE: name + 'group.remove',
  }
}

const ChatEvent = createEventName('chats:')

export default ChatEvent
