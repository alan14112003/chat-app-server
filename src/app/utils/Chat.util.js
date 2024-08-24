import { Op, Sequelize } from 'sequelize'
import Chat from '../models/Chat.model'
import ChatUser from '../models/ChatUser.model'
import User from '../models/User.model'
import Message from '../models/Message.model'
import UserUtil from './User.util'
import EmitEvent from '@/events/Emit.event'
import ChatEvent from '@/events/Chat.event'

const includeMemberAndAdminChat = () => [
  {
    model: User,
    as: 'members',
    attributes: UserUtil.getPublicInfoAttribute(),
    through: {
      as: 'info',
      attributes: ['nickname', 'isBlocked', 'hasNotifyMessage'],
    },
  },
  {
    model: User,
    as: 'adm',
    attributes: UserUtil.getPublicInfoAttribute(),
  },
]

const ChatUtil = {
  createChat: async (friend) => {
    const chatExist = await Chat.findOne({
      where: {
        isGroup: false,
        [Op.and]: [
          Sequelize.literal(`
        (SELECT c2.chatId 
         FROM ChatUsers c2 
         WHERE c2.userId = '${friend.userFrom}'
         AND c2.chatId = Chat.id) IS NOT NULL
      `),
          Sequelize.literal(`
        (SELECT c2.chatId 
         FROM ChatUsers c2 
         WHERE c2.userId = '${friend.userTo}'
         AND c2.chatId = Chat.id) IS NOT NULL
      `),
        ],
      },
    })

    if (chatExist) {
      return
    }

    const chat = await Chat.create({
      isGroup: false,
    })

    await ChatUser.bulkCreate([
      {
        userId: friend.userFrom,
        chatId: chat.id,
      },
      {
        userId: friend.userTo,
        chatId: chat.id,
      },
    ])
  },

  getAllChat: async (userId) => {
    const chats = await Chat.findAll({
      include: [
        {
          model: Message,
          as: 'lastMsg',
          // xử lý thêm
        },
        ...includeMemberAndAdminChat(),
      ],
      where: {
        id: {
          [Op.in]: Sequelize.literal(`
              (SELECT distinct ChatUser.chatId 
              FROM ChatUsers ChatUser 
              WHERE ChatUser.userId = '${userId}')
            `),
        },
      },
    })

    return chats
  },

  getChat: async (chatId) => {
    const chat = await Chat.findOne({
      include: [...includeMemberAndAdminChat()],
      where: {
        id: chatId,
      },
    })

    return chat
  },

  pushNotifyCreateGroup: async (members) => {
    members.forEach((member) => {
      EmitEvent.emit(member, ChatEvent.GROUP_CREATE)
    })
  },

  pushNotifyToChat: async (members, chatId, event) => {
    members.forEach((member) => {
      EmitEvent.emit(member, event, chatId)
    })
  },
}

export default ChatUtil
