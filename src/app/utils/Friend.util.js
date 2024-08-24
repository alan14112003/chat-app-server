import NotificationUtil from './Notification.util'

const FriendUtil = {
  addFriendNotify: async (friend, auth) => {
    await NotificationUtil.createNotification(
      friend,
      auth.avatar,
      friend.userTo
    )
  },
  acceptFriendNotify: async (friend, auth) => {
    await NotificationUtil.createNotification(
      friend,
      auth.avatar,
      friend.userFrom
    )
  },
}

export default FriendUtil
