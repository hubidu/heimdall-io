export default async (id) => {
  const res = await fetch(`http://veve-dev-test-01.intern.v.check24.de:8001/reports/${id}`)
  const json = await res.json()
  return json
}
