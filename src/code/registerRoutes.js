
const path = require('path')
const requireContext = require('require-context-async');
const mockDir = path.join(process.cwd(), 'mock') // mock服务地址

let mockStartIndex // mock中间件在所有中间件的index
let mockRoutesLength // mock中间件的长度
function registerRoutes(app) {
  const mockFileList = requireContext(mockDir, true, /\.js$/)
  const mocks = mockFileList.map(item => {
    return require(item)
  }).reduce((init, next) => {
    return [...init, ...next]
  }, [])
  for (const mock of mocks) {
    const newMock = formatRoute(mock)
    app[newMock.type](newMock.url, newMock.response)
  }
  mockStartIndex = app._router.stack.length - mockRoutesLength
  mockRoutesLength = Object.keys(mocks).length
}
function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

function formatRoute (url, type, respond) {
  return {
    url: url,
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path)
      res.json(respond instanceof Function ? respond(req, res) : respond)
    }
  }
}

function reloadRoutes() {
  app._router.stack.splice(mockStartIndex, mockRoutesLength)
  unregisterRoutes()
  registerRoutes(app)
}

module.exports = {
  registerRoutes,
  reloadRoutes
}