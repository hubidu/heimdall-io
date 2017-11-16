import 'isomorphic-fetch'

export default async () => {
    // eslint-disable-next-line no-undef
    const res = await fetch('http://veve-dev-test-01.intern.v.check24.de:8002/deployments')
    const json = await res.json()

    const addSortKey = item => Object.assign(item, { SortKey: item.FinishedAt})

    return json.map(d => Object.assign(d, { Type: 'deployment-event' })).map(addSortKey)
}
