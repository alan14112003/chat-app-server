import { DataTypes, UUID, UUIDV4 } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const Chat = SequelizeConfig.define(
  'Chat',
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    groupName: {
      type: DataTypes.STRING,
    },
    lastMessage: {
      type: DataTypes.BIGINT,
    },
    groupAdmin: {
      type: DataTypes.UUID,
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
)

export default Chat
