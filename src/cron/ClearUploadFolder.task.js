import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const ClearUploadFolderTask = cron.schedule('*/30 * * * *', async () => {
  try {
    const uploadsFolder = path.join(__dirname, '..', 'uploads')
    const uploadFiles = fs.readdirSync(uploadsFolder)
    const fileRemove = []

    uploadFiles.forEach((uploadFile) => {
      const timeUploadFile = uploadFile.split(/-|\./)[1]
      const timeDif = (Date.now() - timeUploadFile) / (1000 * 60)

      if (timeDif > 20) {
        fileRemove.push(uploadFile)
        fs.rm(path.join(uploadsFolder, uploadFile), (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
    })

    console.log('------clear upload file task start------')

    if (fileRemove.length > 0) {
      console.log('-------remove files---------')
      console.log(fileRemove)
    }

    console.log('------clear upload file task end------')
  } catch (error) {
    console.log(error)
  }
})

export default ClearUploadFolderTask
