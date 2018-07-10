import React from 'react'
import Layout from '../components/layout'

import TestTitle from '../components/test-title'
import TestResultDeviceIcon from '../components/test-result-device-icon'
import TestSourceView from '../components/test-source-view'
import ScreenshotView from '../components/screenshot-view'
import TestHistoryBars from '../components/test-history-bars'

import round from '../services/utils/round'

import getReportById from '../services/get-report-by-id'
import getTestSource from '../services/get-test-source'
import getBrowserlogs from '../services/get-browserlogs'
import getReportsByCategory from '../services/get-reports-by-category'

const lastOf = arr => arr && arr.length > 0 ? arr[arr.length - 1] : undefined

const annotateSource = (source, screenshots) => {
  if (!source) return []
  const sourceLines = source.split('\n')

  const getMeta = (i) => {
    const screenshot = screenshots.find(screenshot => lastOf(screenshot.CodeStack).Location.Line === i)
    if(screenshot) return screenshot
    return
  }

  return sourceLines.map((l, i) => {
    return Object.assign({}, {
      source: l,
      meta: getMeta(i + 1)
    })
  })
}

const getEditorState = screenshots => {
  const maxLine = lastOf(screenshots[0].CodeStack).Location.Line // test stackframe of last screenshot
  const minLine = lastOf(lastOf(screenshots).CodeStack).Source[0].Line // test stackframe of first screenshot
  const filepath = lastOf(lastOf(screenshots).CodeStack).Location.File

  return {
    lineRange: [minLine, maxLine],
    selectedLine: maxLine,
    filepath,
  }
}

const defaultSelectScreenshot = report => report.Screenshots && report.Screenshots.length > 0 && report.Screenshots[0]
const mapToSuccessAndFailure = (historicReports, ownerkey, project) => historicReports ? historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success',
  href: `/details?ownerkey=${ownerkey}&project=${encodeURIComponent(project)}&id=${r._id}&hashcategory=${r.HashCategory}`
})) : undefined

export default class extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, id, hashcategory } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const report = await getReportById(id)
    const [source, browserlogs] = await Promise.all([
      await getTestSource(report.ReportDir),
      await getBrowserlogs(report.ReportDir),
    ])

    const editorState = getEditorState(report.Screenshots)

    return {
      ownerkey,
      project,
      report,
      annotatedSource: annotateSource(source, report.Screenshots),
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
    const history = mapToSuccessAndFailure(historicReports, this.props.ownerkey, this.props.project)
    const successfulRuns = historicReports.concat([Object.assign(this.props.report)]).filter(r => r.Result === 'success')
    const stability = round(successfulRuns.length * 100.0 / historicReports.length)
    return {
      history,
      stability
    }
  }

  async componentDidMount() {
    this.setState({
      selectedScreenshot: defaultSelectScreenshot(this.props.report),
      selectedLine: this.props.editorState.selectedLine,
    })

    const historicReportData = await this.getHistoricReportData()
    this.setState(historicReportData)
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

          { this.state.history &&
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
                  source={this.props.annotatedSource}
                  lineRange={this.props.editorState.lineRange}
                  filepath={this.props.editorState.filepath}
                  onClickLine={this.handleLineClick}

                  selectedLine={this.state.selectedLine}
                  />
                  :
                  <div className="has-text-centered has-text-grey">
                  Test Source not available
                  </div>

              }
            </div>

            <div className="column TestDetails-screenshotViewContainer">
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
