import 'isomorphic-fetch'
import config from './config'

export default async (ownerKey) => {
  const res = await fetch(`http://${config.ReportServiceHost}/projects/${ownerKey}`)
  const json = await res.json()
  return json
}
