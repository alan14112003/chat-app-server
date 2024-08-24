import EmitEvent from '@/events/Emit.event'
import Notification from '../models/Notification.model'
import NotificationEvent from '@/events/Notification.event'

const NotificationUtil = {
  createNotification: async (contentNotify, avatar, userId) => {
    try {
      const notification = await Notification.create({
        content: JSON.stringify(contentNotify),
        checked: false,
        avatar: avatar,
        UserId: userId,
      })

      EmitEvent.emit(userId, NotificationEvent.NEW, notification)
    } catch (error) {
      console.log(error)
    }
  },
}

export default NotificationUtil
