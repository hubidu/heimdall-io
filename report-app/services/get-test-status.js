import 'isomorphic-fetch'
import config from './config'

export default async (ownerkey) => {
  if (!ownerkey) {
    throw new Error('ownerkey is required')
  }
  const res = await fetch(`http://${config.ReportServiceHost}/test-status?ownerkey=${ownerkey}`)
  const json = await res.json()
  return json
}
