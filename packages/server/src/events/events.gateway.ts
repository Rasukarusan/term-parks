import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'socket.io'

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('terminals')
  handleEvent(@MessageBody() pid: number): number {
    const term = globalThis.terms[pid]
    const socket = this.server

    term.on('data', function (msg) {
      console.log('message!!!!', msg)
      socket.send(msg)
    })
    return pid
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('きた2')
    return data
  }
}
