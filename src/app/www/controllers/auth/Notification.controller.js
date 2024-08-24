import Notification from '@/app/models/Notification.model'
import PaginationUtil from '@/app/utils/Pagination.util'

const NotificationController = {
  all: async (req, res, next) => {
    try {
      const auth = req.user

      const notifications = await PaginationUtil.paginate(Notification, 1, 5, {
        order: [['createdAt', 'desc']],
        where: {
          UserId: auth.id,
        },
      })

      return res.status(201).json(notifications)
    } catch (error) {
      next(error)
    }
  },

  checked: async (req, res, next) => {
    try {
      const auth = req.user
      const { id } = req.params

      const updatedCount = await Notification.update(
        {
          checked: true,
        },
        {
          where: {
            UserId: auth.id,
            id: id,
          },
        }
      )

      return res.status(201).json(updatedCount)
    } catch (error) {
      next(error)
    }
  },
}

export default NotificationController
