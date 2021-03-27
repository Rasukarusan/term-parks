import { Injectable, Logger } from '@nestjs/common'
import * as pty from 'node-pty'
import { CreateTerminalRequestDto, DisposeTerminalRequestDto } from './dto'

@Injectable()
export class TerminalService {
  private readonly logger = new Logger(TerminalService.name)

  create(dto: CreateTerminalRequestDto): number {
    const { cols, rows } = dto
    if (!globalThis.terms) globalThis.terms = []
    if (!globalThis.logs) globalThis.logs = []
    const env = Object.assign({}, process.env)
    const shell = process.platform === 'win32' ? 'cmd.exe' : 'zsh'
    env['COLORTERM'] = 'truecolor'
    const term = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols: cols || 80,
      rows: rows || 24,
      cwd: process.platform === 'win32' ? undefined : env.PWD,
      env,
    })
    globalThis.terms[term.pid] = term
    globalThis.logs[term.pid] = ''
    return term.pid
  }

  dispose(dto: DisposeTerminalRequestDto): boolean {
    const { pid } = dto
    this.logger.log(`Target term ${pid}`)
    const term: pty.IPty = globalThis.terms[pid]
    if (!term) {
      this.logger.warn(`Not found term ${pid}`)
      return false
    }
    term.kill()
    this.logger.log(`kill term ${pid}`)
    return true
  }
}
