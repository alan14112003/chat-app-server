import { Server } from 'socket.io'
import EmitEvent from './Emit.event'

const initSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    // thực hiện join vào một room cụ thể của user(mặc định)
    socket.on('join', (room) => {
      console.log(`join room: "${room}", ${typeof room}`)
      socket.join(room) // phải có cái này (không được xóa nó)
    })

    socket.on('leave', (room) => {
      console.log(`leave room: "${room}", ${typeof room}`)
      socket.leave(room) // phải có cái này (không được xóa nó)
    })
  })

  // bắn sự kiện đến một user nào đó từ server
  EmitEvent.on((room, event, ...args) => {
    console.log(`event to room: "${room}", ${typeof room}, event: "${event}"`)
    io.to(room).emit(event, ...args)
  })
}

export default initSocket
