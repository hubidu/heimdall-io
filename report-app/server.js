const path = require('path')
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Pass in report dir via command line parameter
const ReportDir = process.argv[2] || './lib/fixtures'
const reporter = require('./lib/reporter')

app.prepare()
.then(() => {
  const server = express()

  // @deprecated
  server.get('/api/test-runs', async (req, res) => {
    const testRuns = await reporter(ReportDir)
    return res.json(testRuns)
  })

  // @deprecated
  // TODO report-service should do this
  server.get('/api/screenshots/:path/:file', async (req, res) => {
    const screenshotPath = path.join(ReportDir, req.params.path, req.params.file)
    return res.sendFile(path.resolve(screenshotPath))
  })

  // @deprecated
  server.get('/api/assets/:path/:file', async (req, res) => {
    const screenshotPath = path.join(ReportDir, req.params.path, req.params.file)
    return res.sendFile(path.resolve(screenshotPath))
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(4000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:4000')
  })
})
