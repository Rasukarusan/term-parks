import React, { useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Terminal } from 'xterm'

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
  },
})

export const TerminalComponent: React.FC = () => {
  const term = new Terminal()
  const enter = () => term.write('\r\n$ ')
  const backspace = () => term.write('\b \b')
  const setup = () => {
    term.open(document.getElementById('terminal'))
    term.write('Welcome \x1B[1;3;31mxterm.js\x1B[0m')
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
  })
  return <div id="terminal" />
}
