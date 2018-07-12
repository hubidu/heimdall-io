import 'isomorphic-fetch'
import config from './config'

export default async (ownerKey, projectName) => {
  const res = await fetch(`http://${config.ReportServiceHost}/projects/${ownerKey}/${projectName}`, { method: 'delete' })
  const json = await res.json()
  return json
}
