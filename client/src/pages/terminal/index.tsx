import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

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
  return (
    <Layout>
      <div className={classes.container}>
        <Terminal id="terminal" />
      </div>
    </Layout>
  )
}
export default Index
