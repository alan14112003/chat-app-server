import { Op, Sequelize } from 'sequelize'
import User from '../models/User.model'
import Message from '../models/Message.model'
import MessageReaction from '../models/MessageReaction.model'
import ChatUser from '../models/ChatUser.model'
import EmitEvent from '@/events/Emit.event'
import MessageEvent from '@/events/Message.event'
import UserUtil from './User.util'
import Emoji from '../models/Emoji.model'

/**
 *
 * @returns { import("sequelize").Includeable[]} include options
 */
const includeOnMessage = () => [
  {
    model: User,
    as: 'sender',
    attributes: [...UserUtil.getPublicInfoAttribute()],
  },
  {
    model: Message,
    as: 'reply',
    include: [
      {
        model: User,
        as: 'sender',
        attributes: [...UserUtil.getPublicInfoAttribute()],
      },
    ],
  },
  {
    model: MessageReaction,
    as: 'reactions',
    include: [
      {
        model: User,
        as: 'sender',
        attributes: [...UserUtil.getPublicInfoAttribute()],
      },
      {
        model: Emoji,
        as: 'emoji',
      },
    ],
  },
  {
    model: User,
    as: 'seens',
    attributes: [...UserUtil.getPublicInfoAttribute()],
    through: {
      attributes: [],
    },
  },
]

const MessageUtil = {
  getAllMessages: async (chatId, userId, before, limit = 50) => {
    const whereBefore = {}
    if (before) {
      whereBefore.id = {
        [Op.lt]: before,
      }
    }

    const messages = await Message.findAll({
      include: [...includeOnMessage()],
      where: {
        chatId: chatId,
        [Op.and]: [
          {
            id: {
              [Op.notIn]: Sequelize.literal(`(
                SELECT MessageDeleted.messageId
                FROM MessageDeleteds as MessageDeleted 
                WHERE chatId = '${chatId}'
                and userId = '${userId}'
              )`),
            },
          },
          whereBefore,
        ],
      },
      order: [['id', 'DESC']],
      limit: limit,
    })

    return messages
  },
  getAllPinnedMessages: async (chatId, userId) => {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: [...UserUtil.getPublicInfoAttribute()],
        },
      ],
      where: {
        chatId: chatId,
        id: {
          [Op.notIn]: Sequelize.literal(`(
            SELECT MessageDeleted.messageId
            FROM MessageDeleteds as MessageDeleted 
            WHERE chatId = '${chatId}'
            and userId = '${userId}'
          )`),
        },
        isPinned: true,
      },
    })

    return messages
  },
  getMessage: async (messageId, userId) => {
    const message = await Message.findOne({
      include: [...includeOnMessage()],
      where: {
        [Op.and]: [
          {
            id: messageId,
          },
          {
            id: {
              [Op.notIn]: Sequelize.literal(`(
                SELECT MessageDeleted.messageId
                FROM MessageDeleteds as MessageDeleted 
                WHERE messageId = '${messageId}'
                and userId = '${userId}'
              )`),
            },
          },
        ],
      },
    })

    return message
  },
  pushNotifyMessage: async (userId, chatId, typeEvent, ...data) => {
    const chatUsersByChatId = await ChatUser.findAll({
      where: {
        chatId: chatId,
        userId: {
          [Op.ne]: userId,
        },
      },
    })
    chatUsersByChatId.forEach((chatUser) => {
      EmitEvent.emit(chatUser.userId, typeEvent, ...data)
    })
  },
}

export default MessageUtil
