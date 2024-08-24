import { DataTypes, UUID, UUIDV4 } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const User = SequelizeConfig.define(
  'User',
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.TINYINT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPassword: {
      type: DataTypes.STRING(6),
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
)

export default User
