import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'

import TestSourceView from './test-source-view'
import ScreenshotView from './screenshot-view'

const defaultSelectScreenshot = reportScreenshots => reportScreenshots && reportScreenshots.length > 0 && reportScreenshots[0]

import { annotateTestSource, getEditorState } from './annotate-test-source';

class SideBySideView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDiff: false,
    }

    this.isSourceAvailable = this.isSourceAvailable.bind(this)
    this.handleLineClick = this.handleLineClick.bind(this)
    this.handleShowDiffClick = this.handleShowDiffClick.bind(this)
    this.handleStacktraceClick = this.handleStacktraceClick.bind(this)
  }

  init() {
    const {lines, lineGroups} = annotateTestSource(
      this.props.source,
      this.props.reportScreenshots,
      this.isShowDiff() ? this.props.reportScreenshotsDiff : undefined,
    )

    const editorState = getEditorState(lines, this.props.reportScreenshots)

    this.setState({
      lineGroups,
      editorState, // TODO Not a good name
      selectedScreenshot: defaultSelectScreenshot(this.props.reportScreenshots),
      selectedScreenshotIndex: 0,
      selectedScreenshotDiff: defaultSelectScreenshot(this.props.reportScreenshotsDiff),
      selectedLine: editorState.selectedLine,
    })
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Must update reportScreenshotsDiff because this is loaded asynchronously
    if (this.props.reportScreenshotsDiff && !this.state.selectedScreenshotDiff) {
      this.setState({
        selectedScreenshotDiff: defaultSelectScreenshot(this.props.reportScreenshotsDiff),
      })
    }
    // console.log(prevProps, prevState)
  }

  isSourceAvailable() {
    return this.state.lineGroups &&
      this.state.lineGroups.length > 0 &&
      this.state.editorState
  }

  hasADiff() {
    return this.isSourceAvailable() && this.props.reportScreenshotsDiff !== undefined
  }

  isShowDiff() {
    return this.state && this.state.showDiff
  }

  handleShowDiffClick() {
    const isShowDiffNow = !this.isShowDiff()

    // Compute annotatedSource with diff
    const {lines, lineGroups} = annotateTestSource(
      this.props.source,
      this.props.reportScreenshots,
      isShowDiffNow ? this.props.reportScreenshotsDiff: undefined)

    const editorState = getEditorState(lines, this.props.reportScreenshots)

    this.setState({
      showDiff: isShowDiffNow,
      lineGroups,
      editorState,
    })
  }

  handleLineClick({lineNo, line}) {
    this.setState({
      selectedScreenshot: line.meta && line.meta[0],
      selectedScreenshotIndex: 0,
      selectedScreenshotDiff: line.metaDiff && line.metaDiff[0],
      selectedLine: lineNo
    })
  }

  handleStacktraceClick({ screenshot, screenshotIndex}) {
    this.setState({
      selectedScreenshot: screenshot,
      selectedScreenshotIndex: screenshotIndex,
      // TODO Fix this
      // selectedScreenshotDiff: line.metaDiff[0],
    })

  }

  render() {
    return (
      <div className="SideBySideView columns">

        <div className="SideBySideView-firstColumn column is-6">

          <div className="field has-addons">
            { this.hasADiff() &&
              <p className="control">
                <a
                  className="button is-outlined is-small is-success"
                  onClick={e => this.handleShowDiffClick()}
                >
                  { this.isShowDiff() ?
                    <small>
                      Hide Diff
                    </small>
                    :
                    <small>
                      Show Diff
                    </small>
                  }
                </a>
              </p>
            }
            { /*
              <p className="control">
                <a className="button is-outlined is-small is-danger">
                  <small>
                    Show Errors
                  </small>
                </a>
              </p>
              */
            }
          </div>
          {
            this.props.lastSourceCommit && this.props.lastSourceCommit.Subject &&
            <div className="has-text-grey is-size-7">
              "{this.props.lastSourceCommit.Subject}"
              <span className="has-text-grey-light">
              on {moment(this.props.lastSourceCommit.CommittedOn * 1000).format('MMMM Do YYYY, h:mm:ss a')} by {this.props.lastSourceCommit.Committer.Email}
              </span>
            </div>
          }
          { this.isSourceAvailable() ?
              <TestSourceView
                reportId={this.props.reportId}
                startedAt={this.props.startedAt}
                source={this.state.lineGroups}
                lineRange={this.state.editorState.lineRange}
                filepath={this.state.editorState.filepath}
                onClickLine={this.handleLineClick}
                onClickStacktrace={this.handleStacktraceClick}

                selectedLine={this.state.selectedLine}
                selectedScreenshotIndex={this.state.selectedScreenshotIndex}
              />
              :
              <div className="has-text-centered has-text-grey">
                Test Source not available (probably archived?)
              </div>

          }
        </div>

        <div className="column is-6 TestDetails-screenshotViewContainer">
          <ScreenshotView
            reportDir={this.props.reportDir}
            reportDirDiff={this.props.reportDirDiff}
            selectedScreenshot={this.state.selectedScreenshot}
            selectedScreenshotDiff={this.state.showDiff === true && this.state.selectedScreenshotDiff}
          />
        </div>

        <style jsx>{`
          .SideBySideView-firstColumn {
            height: 100vh;
            overflow: auto;
          }
        `}</style>

      </div>
    )
  }
}

SideBySideView.propTypes = {
  reportId: PropTypes.string,
  reportDir: PropTypes.string,
  startedAt: PropTypes.number,
  lastSourceCommit: PropTypes.object,
  source: PropTypes.string,
  reportScreenshots: PropTypes.array,
  reportScreenshotsDiff: PropTypes.array,
}

export default SideBySideView;
