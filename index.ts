import { create, defaults, bodyParser } from 'json-server'
import { loadenv, loadData, choosePort, Config } from './util'
import { join } from 'path'
import glob from 'glob'
const server = create()
const middlewares = defaults({
  static: 'public'
})

server.use(middlewares)
server.use(bodyParser)
// tslint:disable-next-line: no-floating-promises
;(async function () {
  await loadenv(join(__dirname, './'))
  const { DELAY = '', STATUS, MESSAGE, DEFAULT_PORT } = process.env
  server.use((req, res, next) => {
    if (STATUS) {
      const status = parseInt(STATUS, 10) || 200
      res.status(status).send({
        message: MESSAGE
      })
      return
    }
    const delay = parseInt(DELAY, 10) || 0
    setTimeout(next, delay)
  })
  glob('./api/**/*.ts', async (err: Error | null, files: string[]) => {
    if (err) throw err
    const list = files.reduce((src, file) => {
      const item = require(file).default
      return src.concat(item.filter((item: Config) => !!item.path))
    }, [])
    server.get('/index', (_, res) => {
      res
        .send({
          list
        })
        .end()
    })

    loadData(list, server)
    const defaultPort = parseInt(DEFAULT_PORT || '', 10) || 3000
    const port = await choosePort(defaultPort)
    server.listen(port, () => {
      console.log(`JSON Server is running at http://localhost:${port}`)
    })
  })
})()
