import MessageTypeEnum from '@/app/enums/message/messageType.enum'
import AuthCodeEnum from '@/app/enums/response_code/auth/AuthCode.enum'
import ChatCodeEnum from '@/app/enums/response_code/chat/ChatCode.enum'
import StatusCodeEnum from '@/app/enums/response_code/notification/StatusCode.enum'
import Chat from '@/app/models/Chat.model'
import ChatUser from '@/app/models/ChatUser.model'
import Message from '@/app/models/Message.model'
import MessageSeen from '@/app/models/MessageSeen.model'
import User from '@/app/models/User.model'
import ChatUtil from '@/app/utils/Chat.util'
import SequelizeConfig from '@/config/Sequelize.config'
import ChatEvent from '@/events/Chat.event'
import { Op } from 'sequelize'

const ChatController = {
  all: async (req, res, next) => {
    try {
      const auth = req.user

      const chats = await ChatUtil.getAllChat(auth.id)

      return res.status(200).json(chats)
    } catch (error) {
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const chatId = req.params.chatId

      const chat = await ChatUtil.getChat(chatId)

      return res.status(200).json(chat)
    } catch (error) {
      next(error)
    }
  },

  createGroup: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const { groupName, members } = req.body

      // check member valid
      if (members.length < 2) {
        await transaction.rollback()

        return res.status(400).json({
          code: ChatCodeEnum.errGroupMembers,
          message: 'phải thêm ít nhất 2 thành viên để tạo nhóm chat',
        })
      }

      // create chat
      const chat = await Chat.create(
        {
          groupName: groupName,
          groupAdmin: auth.id,
          isGroup: true,
        },
        {
          transaction: transaction,
        }
      )

      const chatUserList = members.map((member) => ({
        userId: member,
        chatId: chat.id,
      }))

      chatUserList.push({
        userId: auth.id,
        chatId: chat.id,
      })

      // add member to chat
      await ChatUser.bulkCreate(chatUserList, {
        transaction: transaction,
      })

      ChatUtil.pushNotifyCreateGroup(members)

      await transaction.commit()

      return res.status(200).json(chat)
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  updateNickname: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { userId, nickname } = req.body

      // check user valid
      const user = await User.findByPk(userId)
      if (!user) {
        transaction.rollback()
        return res.json({
          code: StatusCodeEnum.userNotFound,
          message: 'người dùng không tồn tại',
        })
      }

      // update nickname member
      await ChatUser.update(
        {
          nickname: nickname,
        },
        {
          where: {
            userId: userId,
            chatId: chatId,
          },
          transaction: transaction,
        }
      )

      // create message info change
      await Message.create(
        {
          userId: auth.id,
          chatId: chatId,
          text: `đã đặt biệt danh cho ${user.fullName} là ${nickname}`,
          type: MessageTypeEnum.SYSTEM,
        },
        {
          transaction: transaction,
        }
      )

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
          userId: {
            [Op.ne]: auth.id,
          },
        },
        attributes: ['userId'],
      })

      const members = ChatUsers.map((chatUser) => chatUser.userId)

      ChatUtil.pushNotifyChangeNickname(members, chatId)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  updateGroupName: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { groupName } = req.body

      // update nickname member
      await Chat.update(
        {
          groupName: groupName,
        },
        {
          where: {
            id: chatId,
          },
          transaction: transaction,
        }
      )

      // create message info change
      await Message.create(
        {
          userId: auth.id,
          chatId: chatId,
          text: `đã đổi tên nhóm thành ${groupName}`,
          type: MessageTypeEnum.SYSTEM,
        },
        {
          transaction: transaction,
        }
      )

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
          userId: {
            [Op.ne]: auth.id,
          },
        },
        attributes: ['userId'],
      })

      const members = ChatUsers.map((chatUser) => chatUser.userId)

      ChatUtil.pushNotifyToChat(members, chatId, ChatEvent.GROUP_CHANGE_NAME)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  addMembers: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { members } = req.body

      const chatUserList = members.map((member) => ({
        userId: member,
        chatId: chatId,
      }))

      // add member to chat
      await ChatUser.bulkCreate(chatUserList, {
        transaction: transaction,
      })

      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: members,
          },
        },
        transaction: transaction,
      })

      // create message info add member
      const messageData = users.map((user) => ({
        userId: auth.id,
        chatId: chatId,
        text: `đã thêm ${user.fullName} vào nhóm`,
        type: MessageTypeEnum.SYSTEM,
      }))

      await Message.bulkCreate(messageData, {
        transaction: transaction,
      })

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
          userId: {
            [Op.ne]: auth.id,
          },
        },
        attributes: ['userId'],
        transaction: transaction,
      })

      const userReceives = ChatUsers.map((chatUser) => chatUser.userId)

      ChatUtil.pushNotifyToChat(userReceives, chatId, ChatEvent.GROUP_ADD)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  outGroup: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId

      // check auth is admin
      const chat = await Chat.findByPk(chatId, {
        transaction: transaction,
      })
      if (!chat) {
        await transaction.rollback()
        return res.status(404).json({
          code: StatusCodeEnum.notFound,
          message: 'đoạn chat không tồn tại',
        })
      }

      // delete chat user
      await ChatUser.destroy({
        where: {
          chatId: chatId,
          userId: auth.id,
        },
        transaction: transaction,
      })

      // create message info change
      await Message.create(
        {
          userId: auth.id,
          chatId: chatId,
          text: `đã rời khỏi nhóm`,
          type: MessageTypeEnum.SYSTEM,
        },
        {
          transaction: transaction,
        }
      )

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
        },
        attributes: ['userId'],
        transaction: transaction,
      })

      const userReceives = ChatUsers.map((chatUser) => chatUser.userId)
      // nếu là admin thì thực hiện tạo admin mới cho đoạn chat
      if (chat.groupAdmin === auth.id) {
        await chat.update(
          {
            groupAdmin: userReceives[0],
          },
          {
            transaction: transaction,
          }
        )
      }

      ChatUtil.pushNotifyToChat(userReceives, chatId, ChatEvent.GROUP_OUT)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  removeMember: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { userId } = req.body

      // check auth is admin
      const chat = await Chat.findByPk(chatId, {
        transaction: transaction,
      })
      if (!chat) {
        await transaction.rollback()
        return res.status(404).json({
          code: StatusCodeEnum.notFound,
          message: 'đoạn chat không tồn tại',
        })
      }

      if (chat.groupAdmin !== auth.id) {
        await transaction.rollback()
        return res.status(403).json({
          code: AuthCodeEnum.accessDenined,
          message: 'Bạn không có quyền quản trị viên',
        })
      }

      // delete chat user
      await ChatUser.destroy({
        where: {
          chatId: chatId,
          userId: userId,
        },
        transaction: transaction,
      })

      const user = await User.findByPk(userId, {
        transaction: transaction,
      })

      // create message info change
      await Message.create(
        {
          userId: auth.id,
          chatId: chatId,
          text: `đã xóa ${user.fullName} khỏi nhóm`,
          type: MessageTypeEnum.SYSTEM,
        },
        {
          transaction: transaction,
        }
      )

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
          userId: {
            [Op.ne]: auth.id,
          },
        },
        attributes: ['userId'],
        transaction: transaction,
      })

      const userReceives = ChatUsers.map((chatUser) => chatUser.userId)

      ChatUtil.pushNotifyToChat(userReceives, chatId, ChatEvent.GROUP_REMOVE)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  seen: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId

      // check auth is admin
      const chat = await Chat.findByPk(chatId, {
        transaction: transaction,
      })

      if (!chat) {
        await transaction.rollback()
        return res.status(404).json({
          code: StatusCodeEnum.notFound,
          message: 'đoạn chat không tồn tại',
        })
      }

      if (!chat.lastMessage) {
        await transaction.rollback()
        return res.json({
          code: StatusCodeEnum.success,
          message: 'Thành công',
        })
      }

      const [seenMessage, created] = await MessageSeen.findOrCreate({
        where: {
          userId: auth.id,
          chatId: chatId,
        },
        defaults: {
          messageId: chat.lastMessage,
        },
        transaction: transaction,
      })

      if (!created && seenMessage.messageId !== chat.lastMessage) {
        await seenMessage.update({
          messageId: chat.lastMessage,
        })
      }

      // get list members
      const ChatUsers = await ChatUser.findAll({
        where: {
          chatId: chatId,
          userId: {
            [Op.ne]: auth.id,
          },
        },
        attributes: ['userId'],
        transaction: transaction,
      })

      const userReceives = ChatUsers.map((chatUser) => chatUser.userId)

      ChatUtil.pushNotifyToChat(userReceives, chatId, ChatEvent.SEEN_MSG)

      await transaction.commit()

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },
}

export default ChatController
