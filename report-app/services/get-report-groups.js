import 'isomorphic-fetch'
import config from './config'

import processTags from './tag-processor'

const buildUrl = (opts = {}) => `http://${config.ReportServiceHost}/report-categories?limit=400&ownerkey=${opts.ownerkey}&project=${opts.project || ''}&runid=${opts.runid || ''}`

const isFailedTest = testCategory => testCategory.LastReport.Result === 'error'

export default async (ownerkey, project, runid) => {
    if (!ownerkey) throw new Error('You must provide an ownerkey')

    // eslint-disable-next-line no-undef
    const res = await fetch(buildUrl({
      ownerkey, project, runid
    }))
    const json = await res.json()

    const testCategories = processTags(Object.keys(json).map(category => json[category]))

    const byStartedAt = (a, b) => {
      return a.LastReport.StartedAt - b.LastReport.StartedAt
    }
    const desc = sortFn => (a, b) => -1 * sortFn(a, b)
    const addSortKey = item => Object.assign(item, { SortKey: item.LastReport.StartedAt})

    // Show recently run tests first
    const failedTestCategories = testCategories.filter(isFailedTest).sort(desc(byStartedAt)).map(addSortKey)
    const allTestCategories = testCategories.sort(desc(byStartedAt)).map(addSortKey)

    return { failed: failedTestCategories, succeeded: allTestCategories }
}
