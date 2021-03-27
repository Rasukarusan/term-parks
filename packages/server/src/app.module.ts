import { Module } from '@nestjs/common'
import { EventsModule } from './events/events.module'
import { TerminalModule } from './terminal/terminal.module'

@Module({
  imports: [EventsModule, TerminalModule],
})
export class AppModule {}
