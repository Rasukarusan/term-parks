import React, { useEffect } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import io from 'socket.io-client'

interface Props {
  id: string
  rows?: number
  cols?: number
  fake: boolean
}

interface RealTerminalParams {
  pid?: number
  rows?: number
  cols?: number
  term: Terminal
}

const HOST = 'http://localhost:3001'

export const TerminalComponent: React.FC<Props> = ({
  id,
  cols = 80,
  rows = 24,
  fake,
}) => {
  const [pid, setPid] = React.useState<number>()
  const [term, setTerm] = React.useState<Terminal>()

  const createTerminal = (rows: number, cols: number): Terminal => {
    const term = new Terminal({ cursorBlink: true, cols, rows })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(document.getElementById(id))
    fitAddon.fit()
    term.focus()
    return term
  }

  const setup = () => {
    disposeTerminal()
    const term = createTerminal(rows, cols)
    if (fake) {
      runFakeTerminal(term)
    } else {
      runRealTerminal({ term, rows, cols })
    }
  }

  const runRealTerminal = (params: RealTerminalParams) => {
    const { term, pid, cols, rows } = params
    if (pid) {
      connectTerminal(term, pid)
      return
    }
    fetch(`${HOST}/terminals?cols=${cols}&rows=${rows}`, { method: 'POST' })
      .then((res) => res.text())
      .then((pid) => {
        connectTerminal(term, parseInt(pid))
        setPid(parseInt(pid))
      })
  }

  const connectTerminal = (term: Terminal, pid: number) => {
    const socket = io(HOST)
    socket.emit('connectTerminal', pid)

    // ①1文字入力するたびに実行される
    term.onData((data) => {
      socket.emit('data', { pid, data })
    })
    // ④serverの仮想ターミナルで入力されるたびに実行される
    socket.on('data', (data) => {
      term.write(data)
    })
    setTerm(term)
  }

  const disposeTerminal = () => {
    if (term) {
      term.dispose()
    }
    if (pid) {
      fetch(`${HOST}/terminals/dispose?pid=${pid}`, {
        method: 'POST',
      }).then(() => setPid(null))
    }
    setTerm(null)
  }

  const runFakeTerminal = (term: Terminal): void => {
    term.write('Welcome Term Park! \x1B[1;3;31mFake Terminal Now.\x1B[0m')
    term.write('\r\n$ ')
    term.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
      const ev = e.domEvent
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey

      if (ev.key === 'Enter') {
        term.write('\r\n$ ')
      } else if (ev.key === 'Backspace') {
        if (term.buffer.active.cursorX > 2) {
          term.write('\b \b')
        }
      } else if (printable) {
        term.write(e.key)
      }
    })
    setTerm(term)
  }

  useEffect(() => {
    setup()
  }, [fake])

  return <div id={id} />
}
