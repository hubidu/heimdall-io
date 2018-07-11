import 'isomorphic-fetch'
import config from './config'
const base64 = require('base-64')

export default async (path, filename = 'browserlogs.json') => {
  const url = `http://${config.ReportServiceHost}/attachments/${base64.encode(encodeURIComponent(path))}/${base64.encode(encodeURIComponent(filename))}`

  const res = await fetch(url)
  const source = await res.text()
  return source ? JSON.parse(source) : []
}
