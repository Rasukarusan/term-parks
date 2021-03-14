import { Layout } from '@/components/layout'
import { Terminal } from '@/components/terminal'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
  },
})
const Index: React.FC = () => {
  const classes = useStyles()
  return (
    <Layout>
      <div className={classes.container}>
        <Terminal />
      </div>
    </Layout>
  )
}
export default Index
