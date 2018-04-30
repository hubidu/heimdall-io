import 'isomorphic-fetch'
import config from './config'

const buildUrl = (opts = {}) => `http://${config.ReportServiceHost}/report-categories?limit=400&ownerkey=${opts.ownerkey}&project=${opts.project || ''}`

export default async (ownerkey, project) => {
    if (!ownerkey) throw new Error('You must provide an ownerkey')

    // eslint-disable-next-line no-undef
    const res = await fetch(buildUrl({
      ownerkey, project
    }))
    const json = await res.json()

    const testCategories = Object.keys(json).map(category => json[category])

    const byStartedAt = (a, b) => {
      return a.LastReport.StartedAt - b.LastReport.StartedAt
    }
    const desc = sortFn => (a, b) => -1 * sortFn(a, b)
    const addSortKey = item => Object.assign(item, { SortKey: item.LastReport.StartedAt})

    // Show recently run tests first
    const failedTestCategories = testCategories.filter(category => category.LastReport.Result === 'error').sort(desc(byStartedAt)).map(addSortKey)
    const allTestCategories = testCategories.sort(desc(byStartedAt)).map(addSortKey)

    return { failed: failedTestCategories, succeeded: allTestCategories }
}
