import React from 'react'
import Layout from '../components/layout'

import TestTitle from '../components/test-title'
import TestResultDeviceIcon from '../components/test-result-device-icon'
import TestSourceView from '../components/test-source-view'
import ScreenshotView from '../components/screenshot-view'
import TestHistoryBars from '../components/test-history-bars'

import round from '../services/utils/round'
import lastOf from '../services/utils/last-of'

import getReportById from '../services/get-report-by-id'
import getTestSource from '../services/get-test-source'
import getBrowserlogs from '../services/get-browserlogs'
import getReportsByCategory from '../services/get-reports-by-category'

const getPathToTestSourceFile = screenshots => lastOf(lastOf(screenshots).CodeStack).Location.File

/**
 * Annotate lines in the test source where we have a screenshot
 */
const annotateSource = (source, screenshots) => {
  if (!source) return []

  const sourceLines = source.split('\n')
  const PathToTestSourceFile = getPathToTestSourceFile(screenshots)

  const getMetadataForLine = lineNo => {
    const screenshotWithATestStackframe = screenshot => {
      const presumedTestStackframe = lastOf(screenshot.CodeStack)
      return presumedTestStackframe.Location.Line === lineNo &&
        presumedTestStackframe.Location.File === PathToTestSourceFile
    }

    const screenshot = screenshots.find(screenshotWithATestStackframe)
    return screenshot ? screenshot : undefined
  }

  return sourceLines.map((l, i) => {
    return Object.assign({}, {
      lineNo: i + 1,
      source: l,
      meta: getMetadataForLine(i + 1)
    })
  })
}

/**
 * FInd group ranges of annotated and not annotated lines
 */
const getLineGroupRanges = annotatedSourceLines => {
  if (annotatedSourceLines.length === 0) return []

  const result = []
  const lineFlags = annotatedSourceLines.map(l => l.meta ? 1 : 0)

  let currentValue = lastOf(lineFlags)
  while(currentValue !== undefined) {
    let c = 0

    while(currentValue === lastOf(lineFlags)) {
      c++
      lineFlags.pop()
    }
    result.push(c)

    currentValue = lastOf(lineFlags)
  }

  return result.reverse()
}

/**
 * Group individual lines using the ranges
 */
const groupSourceLines = (annotatedSourceLines, lineGroupRanges) => {
  if (annotatedSourceLines.length === 0) return []

  const lineGroups = []
  let first = 0
  for (let lgRange of lineGroupRanges) {
    let len = lgRange
    const lines  = annotatedSourceLines.slice(first, first + len)

    lineGroups.push({
      first,
      len,
      lines,
      isAnnotated: lines[0].meta !== undefined
    })

    first = first + lgRange
  }

  return lineGroups
}

const getEditorState = (annotatedSource, screenshots) => {
  const getMaxLine = lines => {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].meta) return i +1
    }
    return -1
  }
  const getMinLine = lines => lines.findIndex(l => l.meta)
  const maxLine = getMaxLine(annotatedSource)
  const minLine = getMinLine(annotatedSource)
  const filepath = getPathToTestSourceFile(screenshots)

  return {
    lineRange: [minLine, maxLine],
    selectedLine: maxLine,
    filepath,
  }
}

const defaultSelectScreenshot = report => report.Screenshots && report.Screenshots.length > 0 && report.Screenshots[0]
const createTestDetailLink = (id, ownerkey, project, hashcategory) => `/details?ownerkey=${ownerkey}&project=${encodeURIComponent(project)}&id=${id}&hashcategory=${hashcategory}`
const mapToSuccessAndFailure = (historicReports, ownerkey, project) => historicReports ? historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success',
  href: createTestDetailLink(r._id, ownerkey, project, r.HashCategory)
})) : undefined

export default class extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, id, hashcategory } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const report = await getReportById(id)
    const [source, browserlogs] = await Promise.all([
      await getTestSource(report.ReportDir),
      await getBrowserlogs(report.ReportDir),
    ])

    const annotatedSource = annotateSource(source, report.Screenshots)
    const lineGroupRanges = getLineGroupRanges(annotatedSource)
    const groupedAnnotatedSource = groupSourceLines(annotatedSource, lineGroupRanges)

    const editorState = getEditorState(annotatedSource, report.Screenshots)

    return {
      ownerkey,
      project,
      report,
      annotatedSource,
      groupedAnnotatedSource,
      editorState,
      browserlogs
    }
  }

  constructor(props) {
    super(props)
    this.state = {}

    this.handleLineClick = this.handleLineClick.bind(this)
  }

  async getHistoricReportData(limit) {
    const historicReports =
      await getReportsByCategory(this.props.report.HashCategory, {
        limit,
        since: this.props.report.StartedAt,
        ownerkey: this.props.ownerkey
      })
    if (!historicReports) {
      return {
        history: [],
        stability: 0,
      }
    }

    // Show only reports for same device
    let historicReportsForSameDevice = historicReports.filter(r => r.DeviceSettings.Type === this.props.report.DeviceSettings.Type)

    const history = mapToSuccessAndFailure(historicReportsForSameDevice, this.props.ownerkey, this.props.project)
    historicReportsForSameDevice = historicReportsForSameDevice.concat([Object.assign(this.props.report)])
    const successfulRuns = historicReportsForSameDevice.filter(r => r.Result === 'success')
    const stability = round(successfulRuns.length * 100.0 / historicReportsForSameDevice.length)
    return {
      history,
      stability
    }
  }

  getConsoleErrors() {
    if (!this.props.browserlogs) return []
    console.log(this.props.browserlogs)
    return this.props.browserlogs
  }

  async componentDidMount() {
    this.setState({
      selectedScreenshot: defaultSelectScreenshot(this.props.report),
      selectedLine: this.props.editorState.selectedLine,
    })

    const historicReportData = await this.getHistoricReportData()
    this.setState(historicReportData)

    const consoleErrors = this.getConsoleErrors()
    this.setState({
      consoleErrors,
    })
  }

  handleLineClick({lineNo, line}) {
    this.setState({
      selectedScreenshot: line.meta,
      selectedLine: lineNo
    })
  }

  render () {
    const attrs = {title: `${this.props.report.Title}`, ownerkey: this.props.ownerkey}


    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <div className="TestDetails-title columns">

            <div className="column is-narrow">
              <TestResultDeviceIcon
                result={this.props.report.Result}
                deviceSettings={this.props.report.DeviceSettings} />
            </div>

            <div className="column">
              <TestTitle report={this.props.report} isListView={false}/>
            </div>

          </div>

          { this.state.history && this.state.consoleErrors &&
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">
                  History
                </p>
                <div className="title">
                    <TestHistoryBars
                    data={this.state.history}
                    maxBars={20}
                    />
                </div>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Console Messages</p>
                <p className="title">{this.state.consoleErrors.length}</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Stability</p>
                <p className="title">{this.state.stability} %</p>
              </div>
            </div>
          </div>
          }

          <div className="columns">

            <div className="column is-6">
              { this.props.annotatedSource.length > 0 ?
                  <TestSourceView
                  startedAt={this.props.report.StartedAt}
                  source={this.props.groupedAnnotatedSource}
                  lineRange={this.props.editorState.lineRange}
                  filepath={this.props.editorState.filepath}
                  onClickLine={this.handleLineClick}

                  selectedLine={this.state.selectedLine}
                  />
                  :
                  <div className="has-text-centered has-text-grey">
                  Test Source not available (probably archived?)
                  </div>

              }
            </div>

            <div className="column is-6 TestDetails-screenshotViewContainer">
              <ScreenshotView
                reportDir={this.props.report.ReportDir}

                selectedScreenshot={this.state.selectedScreenshot}
              />
            </div>

          </div>

        </div>
        <style jsx>{`
          .TestDetails-title {
            margin-bottom: 0;
          }
          .TestDetails-history {
          }
          .TestDetails-screenshotViewContainer {
            position: relative;
          }
        `}</style>

      </Layout>
    )
  }
}
