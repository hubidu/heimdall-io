const base64 = require('base-64')

// TODO Make this configurable
const ReportServiceUrl = 'http://veve-dev-test-01.intern.v.check24.de:8001'

// Notice the double encoding. It's because of gin-gonic
export default (path, filename) => `${ReportServiceUrl}/screenshots/${base64.encode(encodeURIComponent(path))}/${base64.encode(encodeURIComponent(filename))}`
