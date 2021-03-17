import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'
import io from 'socket.io-client'

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
})
const Index: React.FC = () => {
  const classes = useStyles()
  const handleClick = () => {
    console.log('click')
    const socket = io('http://localhost:3001')

    socket.on('connect', function () {
      console.log('Connected')

      socket.emit('events', { test: 'test' })
      socket.emit('identity', 0, (response) =>
        console.log('Identity:', response)
      )
    })
    socket.on('events', function (data) {
      console.log('event', data)
    })
    socket.on('exception', function (data) {
      console.log('event', data)
    })
    socket.on('disconnect', function () {
      console.log('Disconnected')
    })
  }
  return (
    <Layout>
      <div className={classes.container}>
        <Terminal id="terminal" />
        <Button onClick={handleClick} color="primary" variant="contained">
          Click
        </Button>
      </div>
    </Layout>
  )
}
export default Index
