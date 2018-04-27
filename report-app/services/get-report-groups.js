import 'isomorphic-fetch'
import config from './config'

const buildUrl = (query = {}) => `http://${config.ReportServiceHost}/report-categories?limit=${query.limit || 400}&project=${query.project || ''}`

export default async (query = {}) => {
    // eslint-disable-next-line no-undef
    const res = await fetch(buildUrl(query))
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
