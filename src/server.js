const path = require('path')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const { registerRoutes, reloadRoutes } = require('./code/registerRoutes')
const chokidar = require('chokidar')
const mockDir = path.join(process.cwd(), 'mock') // mock服务地址
const watch = (app) => {
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add' || event === 'delete') {
      try {
        reloadRoutes(app)
        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}

const server = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  // 注册路由
  registerRoutes(app)
  // 启动监听
  watch(app)
}

module.exports = server