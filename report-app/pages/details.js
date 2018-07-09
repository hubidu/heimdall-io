import React from 'react'
import Layout from '../components/layout'

import TestTitle from '../components/test-title'
import TestResultDeviceIcon from '../components/test-result-device-icon'
import TestSourceView from '../components/test-source-view'
import ScreenshotView from '../components/screenshot-view'

import getReportById from '../services/get-report-by-id'
import getTestSource from '../services/get-test-source'

const lastOf = arr => arr && arr.length > 0 ? arr[arr.length - 1] : undefined

const annotateSource = (source, screenshots) => {
  const sourceLines = source.split('\n')

  const getMeta = (l, i) => {
    const screenshot = screenshots.find(screenshot => lastOf(screenshot.CodeStack).Location.Line === i)
    if(screenshot) return screenshot
    return
  }

  return sourceLines.map((l, i) => {
    return Object.assign({}, {
      source: l,
      meta: getMeta(l, i + 1)
    })
  })
}

const getEditorState = screenshots => {
  const maxLine = lastOf(screenshots[0].CodeStack).Location.Line // test stackframe of last screenshot
  const minLine = lastOf(lastOf(screenshots).CodeStack).Source[0].Line // test stackframe of first screenshot
  const filepath = screenshots[0].CodeStack[0].Location.File

  return {
    lineRange: [minLine, maxLine],
    selectedLine: maxLine,
    filepath,
  }
}

const defaultSelectScreenshot = report => report.Screenshots && report.Screenshots.length > 0 && report.Screenshots[0]

export default class extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, id, hashcategory } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const report = await getReportById(id)
    const source = await getTestSource(report.ReportDir)

    const editorState = getEditorState(report.Screenshots)
    console.log(editorState)

    return {
      ownerkey,
      project,
      report,
      annotatedSource: annotateSource(source, report.Screenshots),
      editorState,
    }
  }

  constructor(props) {
    super(props)
    this.state = {}

    this.handleLineClick = this.handleLineClick.bind(this)
  }

  componentDidMount() {
    this.setState({
      selectedScreenshot: defaultSelectScreenshot(this.props.report),
      selectedLine: this.props.editorState.selectedLine,
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
          <div className="columns">

            <div className="column is-narrow">
              <TestResultDeviceIcon
                result={this.props.report.Result}
                deviceSettings={this.props.report.DeviceSettings} />
            </div>

            <div className="column">
              <TestTitle report={this.props.report} isListView={false}/>
            </div>

          </div>

          <div className="columns">

            <div className="column is-6">
              <TestSourceView
                startedAt={this.props.report.StartedAt}
                source={this.props.annotatedSource}
                lineRange={this.props.editorState.lineRange}
                filepath={this.props.editorState.filepath}
                onClickLine={this.handleLineClick}

                selectedLine={this.state.selectedLine}
              />
            </div>

            <div className="column ScreenshotViewContainer">
              <ScreenshotView
                reportDir={this.props.report.ReportDir}

                selectedScreenshot={this.state.selectedScreenshot}
              />
            </div>

          </div>

        </div>
        <style jsx>{`
        .ScreenshotViewContainer {
          position: relative;
        }
        `}</style>

      </Layout>
    )
  }
}
