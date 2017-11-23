import 'isomorphic-fetch'

export default async (hashCategory) => {
  const res = await fetch(`http://veve-dev-test-01.intern.v.check24.de:8001/report-categories/${hashCategory}`)
  const json = await res.json()
  return json
}
