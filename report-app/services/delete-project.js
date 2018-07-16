import 'isomorphic-fetch'
import config from './config'

export default async (ownerKey, projectName) => {
  const res = await fetch(`http://${config.ReportServiceHost}/projects/${ownerKey}/${projectName}/delete`, { method: 'post' })
  return res
}
