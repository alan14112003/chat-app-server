import MessageController from '@/app/www/controllers/chat/Message.controller'
import ValidatorMiddleware from '@/app/www/middleware/Validator.middleware'
import ReactionValidator from '@/app/www/validators/body/messages/Reaction.validator'
import express from 'express'
// lấy ra bộ định tuyến
const MessageRouter = express.Router()

// MessageId router
MessageRouter.get('/:messageId', MessageController.get)

MessageRouter.post(
  '/:messageId/reaction',
  ValidatorMiddleware.validateBody(ReactionValidator),
  MessageController.reaction
)

MessageRouter.put('/:messageId/pin', MessageController.handlePin)

MessageRouter.delete('/:messageId/delete', MessageController.delete)

MessageRouter.delete('/:messageId/recall', MessageController.recall)

export default MessageRouter
