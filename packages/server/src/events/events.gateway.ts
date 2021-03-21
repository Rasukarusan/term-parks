import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway()
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name)

  @WebSocketServer()
  server: Server

  @SubscribeMessage('connectTerminal')
  handleEvent(@MessageBody() pid: number) {
    const term = globalThis.terms[pid]
    if (!term) {
      this.logger.error(`Not Found terminal ${pid}`)
      return
    }
    this.logger.log('Connected to terminal ' + pid)

    // ③ 仮想ターミナルに書き込みがあるたびに実行される
    term.onData((data) => {
      // bufferUtf8(this.server, 5)
      setTimeout(() => {
        this.server.emit('data', data)
      }, 5)
      // this.server.emit('data', data)
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
