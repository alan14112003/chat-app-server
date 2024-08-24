import Chat from './Chat.model'
import ChatUser from './ChatUser.model'
import Emoji from './Emoji.model'
import Friend from './Friend.model'
import Message from './Message.model'
import MessageDeleted from './MessageDeleted.model'
import MessageReaction from './MessageReaction.model'
import MessageSeen from './MessageSeen.model'
import Notification from './Notification.model'
import User from './User.model'

const initRelationship = () => {
  // --------------chat-------------------
  Chat.belongsTo(Message, {
    foreignKey: 'lastMessage',
    as: 'lastMsg',
  })
  Chat.belongsTo(User, {
    foreignKey: 'groupAdmin',
    as: 'adm',
  })
  Chat.belongsToMany(User, {
    through: {
      model: ChatUser,
      as: 'info',
    },
    as: 'members',
  })
  Chat.hasMany(ChatUser)

  // --------------chat users-------------------
  ChatUser.belongsTo(Chat, {
    foreignKey: 'chatId',
  })
  ChatUser.belongsTo(User, {
    foreignKey: 'userId',
  })

  // -------------message-----------------
  Message.belongsTo(User, {
    foreignKey: 'userId',
    as: 'sender',
  })
  Message.belongsTo(Chat, {
    foreignKey: 'chatId',
    as: 'chat',
  })
  Message.belongsTo(Message, {
    foreignKey: 'replyId',
    as: 'reply',
  })
  Message.hasMany(MessageReaction, {
    as: 'reactions',
  })
  Message.belongsToMany(User, {
    through: MessageSeen,
    as: 'seens',
  })

  // -------------message deleted-----------------
  MessageDeleted.belongsTo(Message, {
    foreignKey: 'messageId',
  })
  MessageDeleted.belongsTo(Chat, {
    foreignKey: 'chatId',
  })
  MessageDeleted.belongsTo(User, {
    foreignKey: 'userId',
  })

  // -------------message reaction-----------------
  MessageReaction.belongsTo(User, {
    foreignKey: 'userId',
    as: 'sender',
  })
  MessageReaction.belongsTo(Emoji, {
    foreignKey: 'emojiId',
    as: 'emoji',
  })

  // -------------friend-----------------
  Friend.belongsTo(User, {
    foreignKey: 'userFrom',
    as: 'from',
  })
  Friend.belongsTo(User, {
    foreignKey: 'userTo',
    as: 'to',
  })

  // -------------message seen-----------------
  MessageSeen.belongsTo(Chat, {
    foreignKey: 'chatId',
  })
  MessageSeen.belongsTo(User, {
    foreignKey: 'userId',
  })
  MessageSeen.belongsTo(Message, {
    foreignKey: 'messageId',
  })

  // -------------message seen-----------------
  Notification.belongsTo(User)
}

export default initRelationship
