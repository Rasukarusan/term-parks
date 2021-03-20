import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('connectTerminal')
  handleEvent(@MessageBody() pid: number) {
    const term = globalThis.terms[pid]
    if (!term) {
      console.log('Not Found terminal ' + pid)
      return
    }
    console.log('Connected to terminal ' + pid)
    const log = globalThis.logs[pid]

    // ③ 仮想ターミナルに書き込みがあるたびに実行される
    term.on('data', (data) => {
      this.server.emit('data', data)
    })
  }

  // ②クライアントのターミナルに入力があるたびに実行される
  @SubscribeMessage('data')
  async data(@MessageBody() params: any) {
    const { pid, data } = params
    const term = globalThis.terms[parseInt(pid)]
    term.write(data)
  }
}
