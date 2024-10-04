import { Sequelize } from 'sequelize'
import { configDotenv } from 'dotenv'

configDotenv()

const SequelizeConfig = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    logging: (...msg) => {
      console.warn('----------SQL----------')
      console.warn(...msg)
      console.warn('--------END SQL--------')
    },
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
    dialectOptions: {
      timezone: '+07:00', // Đặt múi giờ Việt Nam
    },
    timezone: '+07:00', // Cách khác để thiết lập múi giờ GMT+7
  }
)

const test = async () => {
  try {
    await SequelizeConfig.authenticate()

    // await SequelizeConfig.sync({ alter: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
test()

export default SequelizeConfig
