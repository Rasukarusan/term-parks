import { Injectable } from '@nestjs/common'
import * as os from 'os'
import * as pty from 'node-pty'

@Injectable()
export class AppService {
  runTerminal(): number {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh'

    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME + '/Downloads',
      env: process.env,
    })

    ptyProcess.on('data', function (data) {
      process.stdout.write(data)
    })

    ptyProcess.write('touch hogehoge\r')
    ptyProcess.resize(100, 40)
    ptyProcess.write('echo $$\r')
    ptyProcess.write('ps aux | grep $$\r')
    ptyProcess.kill()
    console.log(ptyProcess)
    return ptyProcess.pid
  }
}
