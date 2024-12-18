class VideoCallStateEnum {
    static REQUEST = 1
    static CONNECT = 2

    static allName() {
        return {
            [this.REQUEST]: 'yêu cầu',
            [this.CONNECT]: 'kết nối',
        }
    }

    static getNameByValue(value) {
        return this.allName()[value]
    }
}

export default VideoCallStateEnum
