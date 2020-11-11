const argv = require('minimist')(process.argv.slice(2))
const server = require('./src/server')
/**@type { import('@vue/cli-service').ServicePlugin} */
module.exports = (api) => {
  if (!argv['_'].includes('serve') || argv.mock === 'none') return
  // 启动服务
  api.configureDevServer((app) => {
    server(app)
  })
}