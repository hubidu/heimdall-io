import 'isomorphic-fetch'
import config from './config'

/**
 * Always get the latest test result of a test
 */
export default async (hashCategory) => {
  if (!hashCategory) {
    console.error('Expected to get a hashcategory')
    return {}
  }
  const url = `http://${config.ReportServiceHost}/report-categories/${hashCategory}?latest=true`
  const res = await fetch(url)
  const json = await res.json()

  if (!json) throw new Error(`No result for hashCategory ${hashCategory}`)
  return json[0]
}
