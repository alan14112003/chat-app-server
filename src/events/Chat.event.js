function createEventName(name) {
  return {
    CHANGE_NICKNAME: name + 'change_nickname',
    SEEN_MSG: name + 'seen_msg',
    GROUP_CREATE: name + 'group.create',
    GROUP_CHANGE_NAME: name + 'group.change_name',
    GROUP_ADD: name + 'group.add',
    GROUP_OUT: name + 'group.out',
    GROUP_REMOVE: name + 'group.remove',
    VIDEO_CALL_REQUEST: name + 'video_call_request',
    VIDEO_CALL_JOIN: name + 'video_call_join',
    VIDEO_CALL_REFUSE: name + 'video_call_refuse',
    VIDEO_CALL_TERMINATE: name + 'video_call_terminate',
    VIDEO_CALL_CLOSE: name + 'video_call_close',
  }
}

const ChatEvent = createEventName('chats:')

export default ChatEvent
