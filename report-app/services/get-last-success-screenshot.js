import 'isomorphic-fetch'

export default async (deviceType, hashid) => {
    // eslint-disable-next-line no-undef
    const res = await fetch(`http://veve-dev-test-01.intern.v.check24.de:8001/screenshot-categories/${hashid}?device=${deviceType}`)
    const json = await res.json()

    return json
}
