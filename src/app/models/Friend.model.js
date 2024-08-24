import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const Friend = SequelizeConfig.define(
  'Friend',
  {
    userFrom: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userTo: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    status: {
      type: DataTypes.TINYINT,
    },
  },
  {
    timestamps: false,
  }
)

export default Friend
