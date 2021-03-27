import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common'
import { TerminalModule } from './terminal/terminal.module'
import { TermIoModule } from './term-io/term-io.module'
import { logger } from './logger.middleware'
import { TerminalController } from './terminal/terminal.controller'

@Module({
  imports: [TerminalModule, TermIoModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .exclude({ path: 'terminals/dispose', method: RequestMethod.POST })
      .forRoutes(TerminalController)
  }
}
