import React, { useEffect } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

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
    runFakeTerminal()
  }

  const runFakeTerminal = () => {
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

  useEffect(() => {
    setup()
    return () => term.dispose()
  }, [])

  return <div id={id} />
}
