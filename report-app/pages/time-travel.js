import moment from 'moment'
import Layout from '../components/layout'
import Head from 'next/head'
import {Grid, Container, Segment, Menu, Sidebar, List, Card, Image, Icon, Header, Label, Item} from 'semantic-ui-react'
import Collapsible from '../components/Collapsible'
import TestResultDeviceIcon from '../components/test-result-device-icon'
import SuccessesAndFailuresBars from '../components/SuccessesAndFailuresBars'
import SourceCodeSnippet from '../components/SourceCodeSnippet'

import getReportById from '../services/get-report-by-id'
import getReportsByCategory from '../services/get-reports-by-category'
import getScreenshotUrl from '../services/get-sceenshot-url'

const lastOf = items => items[items.length - 1]
const isErrorStep = step => step.Success === false && step.ReachedAt > 0
const indexOfReport = (report, reports) => reports.findIndex(r => r._id === report._id)
const mapToSuccessAndFailure = historicReports => historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success',
  href: `/details?id=${r._id}&hashcategory=${r.HashCategory}`
}))

const groupScreenshotsIntoSteps = (steps, screenshots) => {
  steps.unshift({
    ReachedAt: 0,
    Success: true,
    ActualName: 'Start'
  })

  steps = steps.map(step => Object.assign(step, {
    Screenshots: []
  }))

  for (let screenshot of screenshots) {
    for (let i = steps.length - 1; i >= 0; i--) {
      let step = steps[i]
      if (step.ReachedAt === 0) continue
      if (screenshot.ShotAt >= step.ReachedAt) {
        step.Screenshots.unshift(screenshot)
        break;
      }
    }
  }
  return steps
}

const ResultIcon = ({step}) => {
  if (step.Success === true)
    return <List.Icon color="green" name="checkmark" />
  if (step.Success === false && step.ReachedAt > 0)
    return <List.Icon color="orange" name="remove" />
  return <List.Icon color="grey" name="circle" />
}

const CommandName = ({screenshot, steps}) => {
  return (
      <span>
        {
          screenshot.CodeStack[0].Source.find(src => src.Line === screenshot.CodeStack[0].Location.Line)
            .Value
            .replace('await', '')
            .replace('(', ' (')
            .trim()
        }
      </span>
    )
}

const Steps = ({steps, onScreenshotHovered}) =>
<div>
  <h3>Steps</h3>
  <List>
  {
    steps.map((step, i) =>
    <List.Item key={i}>
      <ResultIcon step={step} />
      <List.Content>
        <List.Header>
          {step.ActualName || step.Name}
        </List.Header>

        {
          isErrorStep(step) && lastOf(step.Screenshots) &&
            <div className="cf mt2 courier orange ba pa1">
              <strong>
                {lastOf(step.Screenshots).Message}
              </strong>
            </div>
        }

        { step.Screenshots.length > 0 &&
            <List size="mini">
              {
                step.Screenshots.map((screenshot, i) =>
                  <List.Item key={i} onMouseOver={(e) => onScreenshotHovered && onScreenshotHovered(screenshot)}>
                    <List.Header>
                      <List.Icon name='image' size='small' verticalAlign='middle' />
                      <CommandName screenshot={step.Screenshots[i]} steps={steps} />
                    </List.Header>
                  </List.Item>
                )
              }
            </List>
        }
      </List.Content>
    </List.Item>
    )
  }
  </List>
</div>

export default class extends React.Component {
  static async getInitialProps ({ query: { id, hashcategory } }) {
    const report = await getReportById(id)

    const stepsWithScreenshots = groupScreenshotsIntoSteps(report.Outline.Steps, report.Screenshots)

    let history = await getReportsByCategory(hashcategory, {since: report.StartedAt})

    return { report, stepsWithScreenshots, history }
  }

  state = {hoveredScreenshot: undefined}


  onScreenshotHovered = (screenshot) => {
    this.setState({
      hoveredScreenshot: screenshot
    })
  }

  render () {
    return (
      <div className="Container">
        <style global jsx>{`
          // body {
          //   font-family: 'roboto, noto';
          // }
          .SuccessesAndFailuresContainer {
            float: right;
          }
          .Container {
            position: relative;
            height: 100vh;
          }
          .StepPane {
            position: absolute;
            top: 0;
            left: 0;
            width: 30%;
            height: 100%;
            overflow-y: scroll;
          }
          .ScreenshotPane {
            margin-left: 30%;
            height: 100%;
          }
          .ScreenshotContainer {
            height: 90%;
          }
          .ScreenshotContainer-PageTitle {
            font-weight: bold;
          }
          .ScreenshotHeader {
            height: 10%;
          }
          .Screenshot {
            max-height: 100%;
          }
        `}</style>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

          <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css" />
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.7.0/css/tachyons.min.css"/>
          <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
        </Head>
        <div className="StepPane">
          <Segment basic>
            <Steps
              steps={this.props.stepsWithScreenshots}
              hoveredScreenshot={this.state.hoveredScreenshot}
              onScreenshotHovered={this.onScreenshotHovered} />
          </Segment>
        </div>
        <div className="ScreenshotPane">
            <Segment className="ScreenshotHeader" >
              <strong>
              {moment(this.props.report.StartedAt).format("ddd, hA")} ({moment(this.props.report.StartedAt).fromNow()})
              </strong>
              <span className="SuccessesAndFailuresContainer">
                <SuccessesAndFailuresBars
                  selectedBar={indexOfReport(this.props.report, this.props.history)}
                  data={mapToSuccessAndFailure(this.props.history)}
                  maxBars={50}
                />
              </span>

              <Header  as='h3'>
                <TestResultDeviceIcon result={this.props.report.Result} deviceSettings={this.props.report.DeviceSettings} />
                &nbsp;
               {this.props.report.Title}
              </Header>


            </Segment>

            {
              this.state && this.state.hoveredScreenshot &&
                <Segment className="ScreenshotContainer"  basic>
                  <div className="ScreenshotContainer-PageTitle">{this.state.hoveredScreenshot.Page.Title}</div>

                  <a href={this.state.hoveredScreenshot.Page.Url}>
                    {this.state.hoveredScreenshot.Page.Url}
                  </a>
                  <br/>

                  <Collapsible className="mt2" label="Test-Source">
                    <small>
                      { this.state.hoveredScreenshot.CodeStack[1] &&
                        <SourceCodeSnippet code={this.state.hoveredScreenshot.CodeStack[1].Source} location={this.state.hoveredScreenshot.CodeStack[1].Location} />
                      }
                        <SourceCodeSnippet code={this.state.hoveredScreenshot.CodeStack[0].Source} location={this.state.hoveredScreenshot.CodeStack[0].Location} />
                      <pre>
                      <code>
                        {this.state.hoveredScreenshot.OrgStack}
                      </code>
                    </pre>
                    </small>
                  </Collapsible>
                  <br/>

                  <Image bordered={true} className="Screenshot" src={getScreenshotUrl(this.props.report.ReportDir, this.state.hoveredScreenshot.Screenshot)} />
                </Segment>
            }

        </div>
      </div>
      )
  }
}
