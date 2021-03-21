import { Injectable, Logger } from '@nestjs/common'
import * as os from 'os'
import * as pty from 'node-pty'
import { CreateTerminalRequestDto, DisposeRequestDto } from './app.dto'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  createTerminal(dto: CreateTerminalRequestDto): number {
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
      env: env,
    })
    globalThis.terms[term.pid] = term
    globalThis.logs[term.pid] = ''
    return term.pid
  }

  dispose(dto: DisposeRequestDto): boolean {
    const { pid } = dto
    this.logger.log(`Target term ${pid}`)
    console.log(pid)
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
