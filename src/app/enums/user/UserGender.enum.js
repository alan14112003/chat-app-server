const UserGenderEnum = {
  SECRET: 0,
  FEMALE: 1,
  MALE: 2,
  LGBT: 3,

  allName() {
    return {
      [this.SECRET]: 'bí mật',
      [this.FEMALE]: 'nữ',
      [this.MALE]: 'nam',
      [this.LGBT]: 'lgbt',
    }
  },

  getNameByValue(value) {
    return this.allName()[value]
  },

  getValueByName(name) {
    return Object.keys(this.allName()).find((key) => this.allName()[key] === name)
  },
}

export default UserGenderEnum
