import { Op } from 'sequelize'
import FriendStatusEnum from '@/app/enums/friend/FriendStatus.enum'
import Friend from '@/app/models/Friend.model'
import FriendCodeEnum from '@/app/enums/response_code/auth/FriendCode.enum'
import FriendUtil from '@/app/utils/Friend.util'
import User from '@/app/models/User.model'
import UserUtil from '@/app/utils/User.util'
import ChatUtil from '@/app/utils/Chat.util'
import StatusCodeEnum from '@/app/enums/response_code/notification/StatusCode.enum'

const FriendController = {
  all: async (req, res, next) => {
    try {
      const auth = req.user

      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            {
              userFrom: auth.id,
            },
            {
              userTo: auth.id,
            },
          ],
          status: FriendStatusEnum.CONNECT,
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

      return res.status(200).json(friends)
    } catch (error) {
      next(error)
    }
  },

  requests: async (req, res, next) => {
    try {
      const auth = req.user

      const friends = await Friend.findAll({
        where: {
          userTo: auth.id,
          status: FriendStatusEnum.REQUEST,
        },
        include: [
          {
            model: User,
            as: 'from',
            attributes: UserUtil.getPublicInfoAttribute(),
          },
        ],
      })

      return res.status(200).json(friends)
    } catch (error) {
      next(error)
    }
  },

  add: async (req, res, next) => {
    try {
      const auth = req.user
      const { userTo } = req.body

      const friend = await Friend.findOne({
        where: {
          [Op.or]: [
            {
              userFrom: auth.id,
              userTo: userTo,
            },
            {
              userFrom: userTo,
              userTo: auth.id,
            },
          ],
        },
      })

      if (friend) {
        if (friend.status === FriendStatusEnum.CONNECT) {
          return res.status(400).json({
            code: FriendCodeEnum.errConnected,
            message: 'Bạn đã kết bạn với người này rồi',
          })
        }

        return res.status(400).json({
          code: FriendCodeEnum.errRequested,
          message: 'Bạn đã gửi lời mời kết bạn với người này',
        })
      }

      console.log('check')

      const friendCreated = await Friend.create({
        userFrom: auth.id,
        userTo: userTo,
        status: FriendStatusEnum.REQUEST,
      })

      FriendUtil.addFriendNotify(friendCreated, auth)

      return res.status(201).json(friendCreated)
    } catch (error) {
      console.log('error', error)

      next(error)
    }
  },

  accept: async (req, res, next) => {
    try {
      const auth = req.user
      const { userFrom } = req.body

      const friend = await Friend.findOne({
        where: {
          userFrom: userFrom,
          userTo: auth.id,
          status: FriendStatusEnum.REQUEST,
        },
      })

      if (!friend) {
        return res.status(400).json({
          code: FriendCodeEnum.errNoRequested,
          message: 'không có lời mời kết bạn nào từ người này',
        })
      }

      await friend.update({
        status: FriendStatusEnum.CONNECT,
      })

      ChatUtil.createChat(friend)
      FriendUtil.acceptFriendNotify(friend, auth)

      return res.status(200).json(friend)
    } catch (error) {
      next(error)
    }
  },

  remove: async (req, res, next) => {
    try {
      const auth = req.user
      const { userTo } = req.body

      await Friend.destroy({
        where: {
          [Op.or]: [
            {
              userFrom: auth.id,
              userTo: userTo,
            },
            {
              userFrom: userTo,
              userTo: auth.id,
            },
          ],
        },
      })

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'Thành công',
      })
    } catch (error) {
      next(error)
    }
  },
}

export default FriendController
