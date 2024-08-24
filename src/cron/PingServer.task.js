import cron from 'node-cron'

const PingServerTask = cron.schedule('*/30 * * * * *', async () => {
  try {
    console.log('------ping server task start------')
  } catch (error) {
    console.log(error)
  }
})

export default PingServerTask
