const RequestCodeEnum = {
  RESET_PASS: 141,
  ACTIVE: 231,

  allName() {
    return {
      [this.RESET_PASS]: 'lấy lại mật khẩu',
      [this.ACTIVE]: 'kích hoạt tài khoản',
    }
  },

  getNameByValue(value) {
    return this.allName()[value]
  },
}

export default RequestCodeEnum
