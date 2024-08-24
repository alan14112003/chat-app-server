import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const MessageDeleted = SequelizeConfig.define(
  'MessageDeleted',
  {
    chatId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
)

export default MessageDeleted
