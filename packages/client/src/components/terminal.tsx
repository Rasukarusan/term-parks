import React, { useEffect } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import io from 'socket.io-client'

interface Props {
  id: string
}
export const TerminalComponent: React.FC<Props> = ({ id }) => {
  const term = new Terminal({
    cursorBlink: true,
    theme: {
      background: 'black',
    },
  })
  const fitAddon = new FitAddon()
  const enter = () => term.write('\r\n$ ')
  const backspace = () => term.write('\b \b')
  const setup = () => {
    term.loadAddon(fitAddon)
    term.open(document.getElementById(id))
    fitAddon.fit()
    term.focus()

    runRealTerminal()
    // runFakeTerminal()
  }

  const runRealTerminal = (pid?: number) => {
    if (pid) {
      connectTerminal(pid)
      return
    }
    const cols = 80
    const rows = 30
    fetch(`http://localhost:3001/terminals?cols=${cols}&rows=${rows}`, {
      method: 'POST',
    })
      .then((res) => res.text())
      .then((pid) => connectTerminal(parseInt(pid)))
  }

  const connectTerminal = (pid: number) => {
    const socket = io('http://localhost:3001')
    socket.emit('connectTerminal', pid)

    // ①1文字入力するたびに実行される
    term.onData((data) => {
      socket.emit('data', { pid, data })
    })

    // ④serverの仮想ターミナルで入力されるたびに実行される
    socket.on('data', (data) => {
      term.write(data)
    })
  }
  const runFakeTerminal = (): void => {
    term.write('Welcome xterm.js. \x1B[1;3;31mThis is Fake Terminal!\x1B[0m')
    enter()
    term.onKey(onKey)
  }

  const onKey = (e: { key: string; domEvent: KeyboardEvent }) => {
    const ev = e.domEvent
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey

    if (ev.keyCode === 13) {
      enter()
    } else if (ev.keyCode === 8) {
      if (term.buffer.active.cursorX > 2) {
        backspace()
      }
    } else if (printable) {
      term.write(e.key)
    }
  }

  const createTerminal = async () => {
    return await fetch(
      'http://localhost:3001/terminals?cols=' + 100 + '&rows=' + 50,
      {
        method: 'POST',
      }
    ).then((res) => {
      return res.json()
    })
  }

  useEffect(() => {
    setup()
    return () => term.dispose()
  }, [])

  return <div id={id} />
}
