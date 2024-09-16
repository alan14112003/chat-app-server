import Friend from '@/app/models/Friend.model'
import User from '@/app/models/User.model'
import UserUtil from '@/app/utils/User.util'
import { Op, Sequelize } from 'sequelize'

const UserController = {
  findByEmail: async (req, res, next) => {
    try {
      const key = req.query.key
      const auth = req.user

      if (!key || key.trim() === '') {
        return res.status(400).json({
          message: 'key không được để trống',
        })
      }

      // Lấy thông tin người dùng
      const usersRaw = await User.findAll({
        where: {
          email: key,
          id: {
            [Op.ne]: auth.id,
          },
        },
        attributes: UserUtil.getPublicInfoAttribute(),
      })

      const users = JSON.parse(JSON.stringify(usersRaw))

      // kiểm tra họ có kết bạn với người dùng hiện tại không
      const userIDs = users.map((user) => user.id)
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            {
              userFrom: {
                [Op.in]: userIDs,
              },
              userTo: auth.id,
            },
            {
              userFrom: auth.id,
              userTo: {
                [Op.in]: userIDs,
              },
            },
          ],
        },
        include: [
          {
            model: User,
            as: 'from',
            attributes: UserUtil.getPublicInfoAttribute(),
          },
          {
            model: User,
            as: 'to',
            attributes: UserUtil.getPublicInfoAttribute(),
          },
        ],
      })

      // Ánh xạ thông tin bạn bè vào người dùng tương ứng
      const usersWithFriend = users.map((user) => {
        const friend = friends.find(
          (f) => f.userTo === user.id || f.userFrom === user.id
        )
        return { ...user, friend }
      })

      return res.json(usersWithFriend)
    } catch (error) {
      next(error)
    }
  },
}

export default UserController
