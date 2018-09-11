import config from './config'
import {getPathToTestSourceFile} from './stacktrace'

const linkToStory = tag => {const params = parseTag(tag); return params[1] ? `${config.JiraBaseUrl}/${params[1]}` : undefined }
const extractTextFromTag = tag => {const params = parseTag(tag); return params[1] ? params[1] : tag }

export const TagFailing = { name: '@failing', color: 'red' }
export const TagShouldFailButSucceeded = { name: '@should_fail_but_succeeded', color: 'yellow' }
export const TagFlaky = { name: '@flaky', color: 'blue' }
export const TagFixit = { name: '@fixit', color: 'yellow' }
export const TagSmoke = { name: '@smoke', color: 'grey' }
export const TagATDD = { name: '@ATDD', color: 'link' }
export const TagATDDSuccess = { name: '@ATDDSuccess', color: 'green' }
export const TagATDDUnmet = { name: '@ATDDIsUnmet', color: 'yellow' }
export const TagATDDMet = { name: '@ATDDIsUnmet', color: 'yellow' }
export const TagStory = { name: '@story', color: 'link',
  link: linkToStory,
  text: extractTextFromTag
}
export const TagBug = {
  name: '@bug',
  color: 'red',
  link: linkToStory,
  text: extractTextFromTag
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

  const PathToTestSourceFile = getPathToTestSourceFile(report.Screenshots)

  let lastTestStackframe = undefined
  for (let i = 0; i < report.Screenshots.length - 1; i++) { // try all screenshots until we find a test source line
    for (let cs of report.Screenshots[i].CodeStack) {
      if (cs.Location.File === PathToTestSourceFile) {
        lastTestStackframe = cs
        break
      }
    }
    if (lastTestStackframe) {
      break
    }
  }

  if (!lastTestStackframe) return undefined

  return Number(lastTestStackframe.Location.Line)
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

  // console.log(atdd, failedLineInTest(report), report)
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
        testCategory.LastReport.Tags.push(TagATDDSuccess.name)
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
