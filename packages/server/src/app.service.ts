import { Injectable } from '@nestjs/common'
import * as os from 'os'
import * as pty from 'node-pty'

import { CreateTerminalRequestDto, GetTerminalRequestDto } from './app.dto'

@Injectable()
export class AppService {
  createTerminal(dto: CreateTerminalRequestDto): number {
    console.log('来ましたdto', dto)
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh'

    const term = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME + '/Downloads',
      env: process.env,
    })

    term.on('data', function (data) {
      process.stdout.write(data)
    })

    if (!globalThis.terms) globalThis.terms = []
    globalThis.terms[term.pid] = term

    term.write('ls | head\r')
    term.resize(100, 40)
    term.write('echo $$\r')
    term.write('ps aux | grep $$\r')
    // term.kill()
    return term.pid
  }

  getTerminal(pid: number): pty.IPty {
    const term = globalThis.terms[pid]
    return term
  }

  getTerminals(): string[] {
    return Array.isArray(globalThis.terms) ? Object.keys(globalThis.terms) : []
  }
}
