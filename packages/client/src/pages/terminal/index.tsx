import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'
import io from 'socket.io-client'
import { useState } from 'react'

const Terminal = dynamic(
  () => import('@/components/terminal').then((mod) => mod.TerminalComponent),
  {
    ssr: false,
  }
)

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    padding: 20,
  },
  button: {
    margin: 5,
  },
})
const Index: React.FC = () => {
  const classes = useStyles()
  const [data, setData] = useState('')

  const handleClick = async () => {
    console.log('click')
    const socket = io('ws://localhost:3001')
    // const pid = await createTerminal()
    // socket.emit('terminals', pid, (res) => {
    //   console.log('"terminals"にemitした結果', res)
    //   setData(res)
    // })
    return

    socket.on('connect', async () => {
      console.log('Connected')
      const pid = await createTerminal()
      socket.emit('terminals', pid, (res) => {
        console.log('"terminals"にemitした結果', res)
        setData(res)
      })
    })
    socket.on('message', function (data) {
      console.log('きたよえ', data)
    })
    socket.on('terminals', function (data) {
      console.log('event', data)
    })
    socket.on('exception', function (data) {
      console.log('event', data)
    })
    socket.on('disconnect', function () {
      console.log('Disconnected')
    })
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

  const getTerminal = async (pid: number) => {
    return await fetch('http://localhost:3001/terminals/' + pid, {
      method: 'GET',
    }).then((res) => res.json())
  }

  const handleClick2 = async () => {
    const pid = await createTerminal()
    const term = await getTerminal(pid)
    console.log(term)
  }

  const handleClick3 = async () => {
    console.log('click')
    setData('hogeeeeeeeeee')
    return
  }

  return (
    <Layout>
      <div className={classes.container}>
        <Terminal id="terminal" />
        <Button
          className={classes.button}
          onClick={handleClick}
          color="primary"
          variant="contained"
        >
          Click
        </Button>
        <Button
          className={classes.button}
          onClick={handleClick2}
          color="primary"
          variant="contained"
        >
          POST
        </Button>
        <Button
          className={classes.button}
          onClick={handleClick3}
          color="primary"
          variant="contained"
        >
          GET
        </Button>
        <Link href="/">
          <a>HOME</a>
        </Link>
      </div>
    </Layout>
  )
}
export default Index
