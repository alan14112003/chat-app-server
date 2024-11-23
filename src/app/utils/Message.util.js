import { Op, Sequelize } from 'sequelize'
import User from '../models/User.model'
import Message from '../models/Message.model'
import MessageReaction from '../models/MessageReaction.model'
import ChatUser from '../models/ChatUser.model'
import EmitEvent from '@/events/Emit.event'
import MessageEvent from '@/events/Message.event'
import UserUtil from './User.util'
import Emoji from '../models/Emoji.model'
import GeminiModelConfig from '@/config/GeminiModel.config'
import SequelizeConfig from '@/config/Sequelize.config'
import MessageTypeEnum from '../enums/message/messageType.enum'
import Chat from '../models/Chat.model'
import CHAT_BOT_ID from '../enums/message/ChatbotId.enum'

/**
 *
 * @returns { import("sequelize").Includeable[]} include options
 */
const includeOnMessage = (userId) => [
  {
    model: User,
    as: 'sender',
    attributes: [...UserUtil.getPublicInfoAttribute()],
  },
  {
    model: Message,
    as: 'reply',
    required: false,
    where: {
      id: {
        [Op.notIn]: Sequelize.literal(`(
                SELECT MessageDeleted.messageId
                FROM MessageDeleteds as MessageDeleted 
                WHERE chatId = Message.chatId
                and userId = '${userId}'
              )`),
      },
    },
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
      include: [...includeOnMessage(userId)],
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
      limit: Number(limit),
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
      include: [...includeOnMessage(userId)],
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

  createChatBotAnswer: async (message) => {
    const geminiPrefix = '@gemini-ai:'
    const content = message.text

    const question = content.startsWith(geminiPrefix)
      ? content.slice(geminiPrefix.length).trim() // Loại bỏ tiền tố nếu có
      : content

    const transaction = await SequelizeConfig.transaction()
    try {
      const answer = await GeminiModelConfig.generateContent(question)
      const answerMessage = await Message.create(
        {
          userId: CHAT_BOT_ID,
          chatId: message.chatId,
          text: answer.response.text(),
          type: MessageTypeEnum.CHAT_BOT,
          replyId: message.id,
        },
        {
          transaction: transaction,
        }
      )

      await Chat.update(
        {
          lastMessage: answerMessage.id,
        },
        {
          where: {
            id: message.chatId,
          },
          transaction: transaction,
        }
      )

      MessageUtil.pushNotifyMessage(CHAT_BOT_ID, message.chatId, MessageEvent.NEW, answerMessage,)

      await transaction.commit()
    } catch (error) {
      console.log(error);

      await transaction.rollback()
    }
  },
}

export default MessageUtil
