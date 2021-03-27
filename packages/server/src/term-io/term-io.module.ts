import { Module } from '@nestjs/common'
import { TermIoService } from './term-io.service'
import { TermIoGateway } from './term-io.gateway'

@Module({
  providers: [TermIoGateway, TermIoService],
})
export class TermIoModule {}
