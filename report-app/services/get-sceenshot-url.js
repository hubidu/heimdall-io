const base64 = require('base-64')
import config from './config'

const ReportServiceUrl = `http://${config.ReportServiceHost}`

// Notice the double encoding. It's because of gin-gonic
export default (path, filename) => `${ReportServiceUrl}/screenshots/${base64.encode(encodeURIComponent(path))}/${base64.encode(encodeURIComponent(filename))}`
