import ChatController from '@/app/www/controllers/chat/Chat.controller'
import MessageController from '@/app/www/controllers/chat/Message.controller'
import ValidatorMiddleware from '@/app/www/middleware/Validator.middleware'
import AddMembersValidator from '@/app/www/validators/body/chat/AddMembers.validator'
import ChangeGroupNameValidator from '@/app/www/validators/body/chat/ChangeGroupName.validator'
import ChangeNicknameValidator from '@/app/www/validators/body/chat/ChangeNickname.validator'
import CreateGroupValidator from '@/app/www/validators/body/chat/CreateGroup.validator'
import RemoveMemberValidator from '@/app/www/validators/body/chat/RemoveMember.validator'
import express from 'express'
// lấy ra bộ định tuyến
const ChatRouter = express.Router()
const ChatGroupRouter = express.Router()

ChatRouter.get('/', ChatController.all)

// group router
ChatRouter.use('/groups', ChatGroupRouter)

ChatGroupRouter.post(
  '/',
  ValidatorMiddleware.validateBody(CreateGroupValidator),
  ChatController.createGroup
)

ChatGroupRouter.put(
  '/:chatId/name',
  ValidatorMiddleware.validateBody(ChangeGroupNameValidator),
  ChatController.updateGroupName
)

ChatGroupRouter.post(
  '/:chatId/add',
  ValidatorMiddleware.validateBody(AddMembersValidator),
  ChatController.addMembers
)

ChatGroupRouter.post(
  '/:chatId/remove',
  ValidatorMiddleware.validateBody(RemoveMemberValidator),
  ChatController.removeMember
)

ChatGroupRouter.post('/:chatId/out', ChatController.outGroup)

// ChatId router
ChatRouter.get('/:chatId/', ChatController.get)

ChatRouter.put(
  '/:chatId/nickname',
  ValidatorMiddleware.validateBody(ChangeNicknameValidator),
  ChatController.updateNickname
)

ChatRouter.post('/:chatId/seen', ChatController.seen)

// messages
ChatRouter.get('/:chatId/messages', MessageController.all)

ChatRouter.post('/:chatId/messages', MessageController.create)

ChatRouter.get('/:chatId/messages/pins', MessageController.allPinned)

export default ChatRouter
