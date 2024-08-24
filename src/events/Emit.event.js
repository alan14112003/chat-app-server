import EventEmitter from 'events'

const eventEmitter = new EventEmitter()
const EVENT_NAME = 'message.to.room'

const EmitEvent = {
  emit: (room, event, ...args) => {
    return eventEmitter.emit(EVENT_NAME, room, event, ...args)
  },

  /**
   *
   * @param {(room, event, ...args) => {}} cb
   */
  on: (cb) => {
    eventEmitter.on(EVENT_NAME, cb)
  },
}

export default EmitEvent
