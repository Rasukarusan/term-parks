import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'
import * as pty from 'node-pty'

import { CreateTerminalRequestDto, DisposeRequestDto } from './app.dto'

@Controller('terminals')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/')
  createTerminal(@Query() dto: CreateTerminalRequestDto): number {
    return this.appService.createTerminal(dto)
  }

  @Post('/dispose')
  dispose(@Query() dto: DisposeRequestDto): boolean {
    return this.appService.dispose(dto)
  }
}
