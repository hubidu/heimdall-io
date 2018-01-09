import 'isomorphic-fetch'
import config from './config'

export default async (deviceType, hashid) => {
    console.log(`http://${config.ReportServiceHost}/screenshot-categories/${hashid}?device=${deviceType}`)
    // eslint-disable-next-line no-undef
    const res = await fetch(`http://${config.ReportServiceHost}/screenshot-categories/${hashid}?device=${deviceType}`)
    const json = await res.json()

    return json
}
