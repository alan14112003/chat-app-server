class MessageTypeEnum {
  static TEXT = 0
  static IMAGE = 1
  static FILE = 2
  static SYSTEM = 100
  static CHAT_BOT = 50

  static allName() {
    return {
      [this.TEXT]: 'văn bản',
      [this.IMAGE]: 'hình ảnh',
      [this.FILE]: 'tệp tin',
      [this.SYSTEM]: 'hệ thống',
      [this.CHAT_BOT]: 'chat bot',
    }
  }

  static getNameByValue(value) {
    return this.allName()[value]
  }
}

export default MessageTypeEnum
