import { Module } from '@nestjs/common'
import { TerminalModule } from './terminal/terminal.module'
import { TermIoModule } from './term-io/term-io.module'

@Module({
  imports: [TerminalModule, TermIoModule],
})
export class AppModule {}
