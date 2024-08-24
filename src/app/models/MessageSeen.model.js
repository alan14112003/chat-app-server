import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const MessageSeen = SequelizeConfig.define(
  'MessageSeen',
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    timestamps: false,
  }
)

export default MessageSeen
