import 'isomorphic-fetch'

const serialize = obj => {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export default async (hashCategory, params = {}) => {
  const actualParams = Object.assign({limit: 100}, params)
  const res = await fetch(`http://veve-dev-test-01.intern.v.check24.de:8001/report-categories/${hashCategory}?${serialize(actualParams)}`)
  const json = await res.json()
  return json
}
