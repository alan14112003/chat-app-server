import cron from 'node-cron'
import ChapterUtil from '@/app/utils/Chapter.util'

const PublicChapterTask = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('------public chapter task start------')

    const chapterIds = await ChapterUtil.publicChapterTask()

    console.log('public chapter: ', chapterIds)

    console.log('------public chapter task end------')
  } catch (error) {
    console.log(error)
  }
})

export default PublicChapterTask
