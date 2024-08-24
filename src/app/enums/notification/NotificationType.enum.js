const NotificationTypeEnum = {
  ADD_FRIEND: 1,
  ACCEPT_FRIEND: 5,

  allName() {
    return {
      [this.ADD_FRIEND]: 'Yêu cầu kết bạn',
      [this.ACCEPT_FRIEND]: 'Chấp nhận lời mời kết bạn',
    }
  },

  getNameByValue(value) {
    return this.allName()[value]
  },
}

export default NotificationTypeEnum
