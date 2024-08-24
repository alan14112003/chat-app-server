class FriendStatusEnum {
  static REQUEST = 0
  static CONNECT = 1

  static allName() {
    return {
      [this.REQUEST]: 'yêu cầu',
      [this.CONNECT]: 'bạn bè',
    }
  }

  static getNameByValue(value) {
    return this.allName()[value]
  }
}

export default FriendStatusEnum
