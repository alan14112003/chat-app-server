import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const Message = SequelizeConfig.define(
  'Message',
  {
    userId: {
      type: DataTypes.UUID,
    },
    chatId: {
      type: DataTypes.UUID,
    },
    text: {
      type: DataTypes.TEXT,
    },
    file: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.TINYINT,
    },
    replyId: {
      type: DataTypes.BIGINT,
    },
    isRecall: {
      type: DataTypes.BOOLEAN,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
)

export default Message
