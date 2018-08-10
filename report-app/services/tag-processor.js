import config from './config'
import lastOf from './utils/last-of'

export const TagFailing = { name: '@failing', color: 'red' }
export const TagShouldFailButSucceeded = { name: '@should_fail_but_succeeded', color: 'yellow' }
export const TagFlaky = { name: '@flaky', color: 'blue' }
export const TagSmoke = { name: '@smoke', color: 'grey' }
export const TagATDD = { name: '@ATDD', color: 'link' }
export const TagATDDUnmet = { name: '@ATDDIsUnmet', color: 'yellow' }
export const TagATDDMet = { name: '@ATDDIsUnmet', color: 'yellow' }
export const TagStory = { name: '@story', color: 'link',
  link: (tag) => {const params = parseTag(tag); return params[1] ? `${config.JiraBaseUrl}/${params[1]}` : undefined }
}

export const matches = (tag, tagAsStr) => {
  const parsedTag = tagAsStr.split(':')
  return tag.name === parsedTag[0]
}

const isFailedTest = testCategory => testCategory.LastReport.Result === 'error'
const isSuccessfulTest = testCategory => testCategory.LastReport.Result === 'success'
const failedLineInTest = report => {
  if (!report.Screenshots) return undefined
  if (!report.Screenshots[0]) return undefined
  const testStackframe = lastOf(report.Screenshots[0].CodeStack)
  if (!testStackframe) return undefined

  return Number(testStackframe.Location.Line)
}

const hasTag = (tags, t) => tags.findIndex(tag => tag.indexOf(t.name) === 0) >= 0
const getTag = (tags, t) => tags.find(tag => tag.indexOf(t.name) === 0)
const getTagIndex = (tags, t) => tags.findIndex(tag => tag.indexOf(t.name) === 0)
const parseTag = tag => tag.split(':')
const parseATDDTag = (tag) => {
  const params = parseTag(tag)
  if (params.length <= 1) return {}
  return {
    lineNo: Number(params[1])
  }
}
const isATDDUnmetExpectation = (tag, report) => {
  const atdd = parseATDDTag(tag)
  return report.Result === 'error' && atdd.lineNo === failedLineInTest(report)
}

/**
 * Fix up test results using well-known tags
 */
const processTags = testCategories => {

  return testCategories
    .map(testCategory => {
      const tags = testCategory.LastReport.Tags

      if (isFailedTest(testCategory) && hasTag(tags, TagATDD)) {
        if (isATDDUnmetExpectation(getTag(tags, TagATDD), testCategory.LastReport)) {
          testCategory.LastReport.Result = 'warning'
          testCategory.LastReport.Tags.push(TagATDDUnmet.name)
        }
      }

      if (isSuccessfulTest(testCategory) && hasTag(tags, TagATDD)) {
        const idx = getTagIndex(tags, TagATDD)
        testCategory.LastReport.Tags.splice(idx, 1) // remove ATDD tag
      }

      if (isSuccessfulTest(testCategory) && hasTag(tags, TagFailing)) {
        testCategory.LastReport.Tags.push(TagShouldFailButSucceeded.name)
        testCategory.LastReport.Result = 'error'
      } else if (isFailedTest(testCategory) && hasTag(tags, TagFailing)) {
        testCategory.LastReport.Result = 'success'
      }
      return testCategory
    })
}

export default processTags
