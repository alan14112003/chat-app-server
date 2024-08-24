function createEventName(name) {
  return {
    NEW: name + 'new',
    PIN: name + 'pin',
    RECALL: name + 'recall',
    REACTION: name + 'reaction',
  }
}

const MessageEvent = createEventName('messages:')

export default MessageEvent
