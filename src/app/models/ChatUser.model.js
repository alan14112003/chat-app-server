import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const ChatUser = SequelizeConfig.define(
  'ChatUser',
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
    },
    hasNotifyMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
)

export default ChatUser
