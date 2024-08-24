function createEventName(name) {
  return {
    NEW: name + 'new',
  }
}

const NotificationEvent = createEventName('notifications:')

export default NotificationEvent
