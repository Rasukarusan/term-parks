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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Terminal id="terminal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Terminal id="terminal2" />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}
export default Index
