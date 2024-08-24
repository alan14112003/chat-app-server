import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const MessageReaction = SequelizeConfig.define(
  'MessageReaction',
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    emojiId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    timestamps: false,
  }
)

export default MessageReaction
