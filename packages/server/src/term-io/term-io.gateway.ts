import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { TermIoService } from './term-io.service'
import { ConnectTermDto, DataTermDto } from './dto'

@WebSocketGateway()
export class TermIoGateway {
  constructor(private readonly service: TermIoService) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('connectTerm')
  connect(@MessageBody() dto: ConnectTermDto) {
    this.service.connect(this.server, dto)
  }

  // ②クライアントのターミナルに入力があるたびに実行される
  @SubscribeMessage('data')
  data(@MessageBody() dto: DataTermDto) {
    this.service.data(dto)
  }
}
