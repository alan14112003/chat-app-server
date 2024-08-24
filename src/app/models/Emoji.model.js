import { DataTypes } from 'sequelize'
import SequelizeConfig from '@/config/Sequelize.config'

const Emoji = SequelizeConfig.define(
  'Emoji',
  {
    name: {
      type: DataTypes.STRING,
    },
    src: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
)

export default Emoji
