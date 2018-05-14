import 'isomorphic-fetch'
import config from './config'


const serialize = obj => {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export default async (hashCategory, params = {}) => {
  if (!hashCategory) {
    console.error('Expected to get a hashcategory')
    return {}
  }
  const actualParams = Object.assign({limit: 100}, params)
  const url = `http://${config.ReportServiceHost}/report-categories/${hashCategory}?${serialize(actualParams)}`
  const res = await fetch(url)
  const json = await res.json()
  return json
}
