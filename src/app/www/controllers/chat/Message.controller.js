import MessageTypeEnum from '@/app/enums/message/messageType.enum'
import AuthCodeEnum from '@/app/enums/response_code/auth/AuthCode.enum'
import StatusCodeEnum from '@/app/enums/response_code/notification/StatusCode.enum'
import Chat from '@/app/models/Chat.model'
import Message from '@/app/models/Message.model'
import MessageDeleted from '@/app/models/MessageDeleted.model'
import MessageReaction from '@/app/models/MessageReaction.model'
import MessageUtil from '@/app/utils/Message.util'
import SequelizeConfig from '@/config/Sequelize.config'
import MessageEvent from '@/events/Message.event'

const MessageController = {
  all: async (req, res, next) => {
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { limit = 50, before } = req.query

      const messages = await MessageUtil.getAllMessages(
        chatId,
        auth.id,
        before,
        limit
      )

      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  },

  allPinned: async (req, res, next) => {
    try {
      const auth = req.user
      const chatId = req.params.chatId

      const messages = await MessageUtil.getAllPinnedMessages(chatId, auth.id)

      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const auth = req.user
      const messageId = req.params.messageId

      const message = await MessageUtil.getMessage(messageId, auth.id)

      return res.status(200).json(message)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const chatId = req.params.chatId
      const { text, file, image, type, replyId } = req.body

      const message = await Message.create(
        {
          userId: auth.id,
          chatId: chatId,
          text,
          file,
          image,
          type,
          replyId,
        },
        {
          transaction: transaction,
        }
      )

      await Chat.update(
        {
          lastMessage: message.id,
        },
        {
          where: {
            id: chatId,
          },
          transaction: transaction,
        }
      )

      MessageUtil.pushNotifyMessage(
        auth.id,
        chatId,
        MessageEvent.NEW,
        message.id
      )

      await transaction.commit()
      return res.status(200).json(message)
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  handlePin: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const messageId = req.params.messageId

      const message = await Message.findByPk(messageId)
      const isPinned = !message.isPinned

      await message.update(
        {
          isPinned: isPinned,
        },
        {
          transaction: transaction,
        }
      )

      const messageNew = await Message.create(
        {
          userId: auth.id,
          chatId: message.chatId,
          text: `đã ${isPinned ? 'ghim' : 'bỏ ghim'} 1 tin nhắn`,
          type: MessageTypeEnum.SYSTEM,
        },
        {
          transaction: transaction,
        }
      )

      MessageUtil.pushNotifyMessage(auth.id, message.chatId, MessageEvent.PIN)

      await transaction.commit()
      return res.status(200).json(messageNew)
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },

  reaction: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const messageId = req.params.messageId
      const { emojiId } = req.body

      const message = await Message.findByPk(messageId, {
        transaction: transaction,
      })

      const [reactionMessage, created] = await MessageReaction.findOrCreate({
        where: {
          userId: auth.id,
          messageId: messageId,
        },
        defaults: {
          emojiId: emojiId,
        },
        transaction: transaction,
      })

      if (!created) {
        if (reactionMessage.emojiId !== emojiId) {
          await reactionMessage.update(
            {
              emojiId: emojiId,
            },
            {
              transaction: transaction,
            }
          )
        } else {
          await reactionMessage.destroy({
            transaction: transaction,
          })
        }
      }

      MessageUtil.pushNotifyMessage(
        auth.id,
        message.chatId,
        MessageEvent.REACTION,
        message.id
      )

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

  delete: async (req, res, next) => {
    try {
      const auth = req.user
      const messageId = req.params.messageId

      const message = await Message.findByPk(messageId)

      await MessageDeleted.create({
        chatId: message.chatId,
        messageId: message.id,
        userId: auth.id,
      })

      return res.status(200).json({
        code: StatusCodeEnum.success,
        message: 'thành công',
      })
    } catch (error) {
      next(error)
    }
  },

  recall: async (req, res, next) => {
    const transaction = await SequelizeConfig.transaction()
    try {
      const auth = req.user
      const messageId = req.params.messageId

      const message = await Message.findByPk(messageId)

      if (auth.id !== message.userId) {
        transaction.rollback()
        return res.status(403).json({
          code: AuthCodeEnum.accessDenined,
          message: 'bạn không có quyền',
        })
      }

      await message.update(
        {
          text: null,
          file: null,
          image: null,
          isRecall: true,
        },
        {
          transaction: transaction,
        }
      )

      MessageUtil.pushNotifyMessage(
        auth.id,
        message.chatId,
        MessageEvent.RECALL,
        message.chatId,
        message.id
      )

      await transaction.commit()
      return res.status(200).json(message)
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  },
}

export default MessageController
