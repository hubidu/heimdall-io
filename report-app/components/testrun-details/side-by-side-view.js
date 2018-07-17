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
  }

  init() {
    const {lines, lineGroups} = annotateTestSource(
      this.props.source,
      this.props.reportScreenshots,
      this.props.reportScreenshotsDiff
    )
    const editorState = getEditorState(lines, this.props.reportScreenshots)

    this.setState({
      lineGroups,
      editorState, // TODO Not a good name
      selectedScreenshot: defaultSelectScreenshot(this.props.reportScreenshots),
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
    return this.state.showDiff
  }

  handleShowDiffClick() {
    const showOrNotShow = !this.state.showDiff

    // Compute annotatedSource with diff
    const {lines, lineGroups} = annotateTestSource(
      this.props.source,
      this.props.reportScreenshots,
      showOrNotShow ? this.props.reportScreenshotsDiff: undefined)

    const editorState = getEditorState(lines, this.props.reportScreenshots)

    this.setState({
      showDiff: showOrNotShow,
      lineGroups,
      editorState,
    })
  }

  handleLineClick({lineNo, line}) {
    this.setState({
      selectedScreenshot: line.meta,
      selectedScreenshotDiff: line.metaDiff,
      selectedLine: lineNo
    })
  }

  render() {
    return (
      <div className="columns">

        <div className="column is-6">

          <div className="field has-addons">
            <p className="control">
            { this.hasADiff() &&
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
            }
            </p>
            <p className="control">
              <a className="button is-outlined is-small is-danger">
                <small>
                  Toggle Errors
                </small>
            </a>
            </p>
          </div>

          { this.isSourceAvailable() ?
              <TestSourceView
              startedAt={this.props.startedAt}
              source={this.state.lineGroups}
              lineRange={this.state.editorState.lineRange}
              filepath={this.state.editorState.filepath}
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
            reportDir={this.props.reportDir}

            selectedScreenshot={this.state.selectedScreenshot}
            selectedScreenshotDiff={this.state.showDiff === true && this.state.selectedScreenshotDiff}
          />
        </div>

      </div>
    )
  }
}

SideBySideView.propTypes = {
  reportDir: PropTypes.string,
  startedAt: PropTypes.number,
  source: PropTypes.string,
  reportScreenshots: PropTypes.array,
  reportScreenshotsDiff: PropTypes.array,
}

export default SideBySideView;
