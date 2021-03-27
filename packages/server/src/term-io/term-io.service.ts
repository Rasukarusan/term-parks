import { Injectable } from '@nestjs/common'
import { ConnectTermDto } from './dto/connect-term.dto'
import { Logger } from '@nestjs/common'
import { Server } from 'socket.io'
import { DataTermDto } from './dto'

@Injectable()
export class TermIoService {
  private readonly logger = new Logger(TermIoService.name)

  connect(server: Server, dto: ConnectTermDto) {
    const { pid } = dto
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
        server.emit('data', data)
      }, 5)
      // this.server.emit('data', data)
    })
  }

  data(dto: DataTermDto) {
    const { pid, data } = dto
    const term = globalThis.terms[pid]
    term.write(data)
  }
}
