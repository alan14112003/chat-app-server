class MessageTypeEnum {
  static TEXT = 0
  static IMAGE = 1
  static FILE = 2
  static SYSTEM = 100

  static allName() {
    return {
      [this.TEXT]: 'văn bản',
      [this.IMAGE]: 'hình ảnh',
      [this.FILE]: 'tệp tin',
      [this.SYSTEM]: 'hệ thống',
    }
  }

  static getNameByValue(value) {
    return this.allName()[value]
  }
}

export default MessageTypeEnum
