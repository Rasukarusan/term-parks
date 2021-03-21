import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, Box } from '@material-ui/core'
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
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
  },
})
const Index: React.FC = () => {
  const classes = useStyles()
  const [fake, setFake] = useState(true)

  const handleConnect = () => {
    setFake(!fake)
  }

  return (
    <Layout>
      <div className={classes.container}>
        <Terminal id="terminal" fake={fake} />
        <Button
          className={classes.button}
          onClick={handleConnect}
          color={fake ? 'primary' : 'secondary'}
          variant="contained"
          fullWidth={false}
        >
          {fake
            ? 'Connect Real Terminal'
            : 'Dispose and Switch to Fake Terminal'}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => (location.href = '/')}
        >
          HOME
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => location.reload()}
        >
          RELOAD
        </Button>
      </div>
    </Layout>
  )
}
export default Index
