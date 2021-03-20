import { Injectable } from '@nestjs/common'
import * as os from 'os'
import * as pty from 'node-pty'
import { CreateTerminalRequestDto } from './app.dto'

@Injectable()
export class AppService {
  createTerminal(dto: CreateTerminalRequestDto): number {
    const { cols, rows } = dto
    if (!globalThis.terms) globalThis.terms = []
    if (!globalThis.logs) globalThis.logs = []
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh'

    const term = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: process.env.HOME,
      env: process.env,
    })
    globalThis.terms[term.pid] = term
    globalThis.logs[term.pid] = ''
    return term.pid
  }
}
