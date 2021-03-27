import { Controller, Post, Query } from '@nestjs/common'
import { TerminalService } from './terminal.service'
import { CreateTerminalRequestDto, DisposeTerminalRequestDto } from './dto'

@Controller('terminals')
export class TerminalController {
  constructor(private readonly service: TerminalService) {}

  @Post('/')
  create(@Query() dto: CreateTerminalRequestDto): number {
    return this.service.create(dto)
  }

  @Post('/dispose')
  dispose(@Query() dto: DisposeTerminalRequestDto): boolean {
    return this.service.dispose(dto)
  }
}
