import SequelizeConfig from '@/config/Sequelize.config'
import { DataTypes } from 'sequelize'

const Notification = SequelizeConfig.define(
  'Notification',
  {
    content: {
      type: DataTypes.TEXT,
    },
    checked: {
      type: DataTypes.BOOLEAN,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
)

export default Notification
