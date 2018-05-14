import React from 'react'
import{List, Card, Image, Icon, Header, Label, Item} from 'semantic-ui-react'
import moment from 'moment'

import Layout from '../components/layout'
import Collapsible from '../components/Collapsible'
import SourceCodeSnippet from '../components/SourceCodeSnippet'
import SuccessesAndFailuresBars from '../components/SuccessesAndFailuresBars'
import TestResultDeviceIcon from '../components/test-result-device-icon'

import getReportById from '../services/get-report-by-id'
import getReportsByCategory from '../services/get-reports-by-category'
import getScreenshotUrl from '../services/get-sceenshot-url'
import getLastSuccessScreenshot from '../services/get-last-success-screenshot'

import SuccessIcon from 'react-icons/lib/fa/check'
import FailIcon from 'react-icons/lib/md/close'

const MAX_RECENT_FAILURES = 4

const mapToSuccessAndFailure = (historicReports, ownerkey, project) => historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success',
  href: `/details?ownerkey=${ownerkey}&project=${encodeURIComponent(project)}&id=${r._id}&hashcategory=${r.HashCategory}`
}))

const AtSecond = ({shotAt, startShotAt}) =>
  <span>
    {(shotAt - startShotAt) / 1000}
  </span>

const toString = v => {
  if (typeof v === 'object') return JSON.stringify(v)
  return v.toString()
}

const CommandName = ({screenshot, steps}) => {
  const getSourceLine = ss => ss.CodeStack[0].Source.find(src => src.Line === ss.CodeStack[0].Location.Line)
      .Value
      .replace('await', '')
      .replace('(', ' (')
      .trim()

  const FormattedCmdArgs = ({screenshot: ss}) => {
    const zip = (a1, a2) => {
      const ret = []
      return a1.map((item, i) => [a1[i], a2[i]])
    }
    const fnValues = ss.Cmd.Args.map(toString)

    if (ss.CodeStack.length > 0) {
      const sourceLine = getSourceLine(ss)
      const fnParamsStr = sourceLine.match(/\(\s*([^)]+?)\s*\)/)
      const fnParams = fnParamsStr[1].split(/\s*,\s*/)
      const fnParamsAndValues = zip(fnParams, fnValues)

      // TODO Add back the fn param names
      return (
        fnParamsAndValues.map((pv, i) =>
          <span>
            <strong className="blue">'{pv[1]}'</strong>
            {i < fnParamsAndValues.length - 1 ? ', ': ''}
          </span>
        )
      )
    }
    return (
      fnValues.map((v, i) =>
        <span>
          <strong className="blue">'{v}'</strong>
          {i < v.length - 1 ? ', ': ''}
        </span>
      )
    )
}

  const correspondingStep = steps.find(step => step.ReachedAt === screenshot.ShotAt)
  if (correspondingStep) {
    return (
      <span>
        <ResultIcon step={correspondingStep} />
        {correspondingStep.ActualName || correspondingStep.Name}
      </span>
    )
  }

  if (screenshot.Cmd.Name) {
    return (
      <span>
        <strong>I {screenshot.Cmd.Name}</strong> <FormattedCmdArgs screenshot={screenshot} />
      </span>
    )
  }
  // Fallback: No cmd
  return (
      <span>
        { screenshot.CodeStack.length > 0 &&
            getSourceLine(screenshot)
        }
      </span>
    )
}

const color = success => success ? 'green' : 'orange'

const trunc = msg => msg ? msg.substring(0, 50) + '...' : msg

const indexOfReport = (report, reports) => reports.findIndex(r => r._id === report._id)

const Timeline = ({reportDir, steps, startTimeline, lastSuccessScreenshotOfReport, timeline}) =>
  <div className="Timeline mt4">
    <h3>Screenshots ({timeline.length})</h3>

    <Card.Group itemsPerRow={4}>
    {
      timeline.map((s, i) =>
            <Card key={i}>
              <Card.Content>

                <Card.Meta>
                  <small>
                    after <AtSecond shotAt={s.ShotAt} startShotAt={startTimeline} />s
                  </small>
                  {
                    i === 0 && lastSuccessScreenshotOfReport &&
                      <small>
                        <a
                          target="_blank"
                          href={getScreenshotUrl(lastSuccessScreenshotOfReport.ReportDir, lastSuccessScreenshotOfReport.Screenshot.Screenshot)}>
                          Compare to success...
                        </a>
                      </small>
                  }

                </Card.Meta>

                <Card.Meta>
                  <a className="f6" href={s.Page.Url}>{s.Page.Title}</a>
                </Card.Meta>

                <div className="blue f7">
                  <a href={s.Page.Url}>{s.Page.Url.slice(0, 80)}</a>
                </div>

                <div className="mt2 f6 h3">
                  <CommandName screenshot={s} steps={steps} />
                </div>

                <Image
                  as='a'
                  size='large'
                  target='_blank'
                  href={getScreenshotUrl(reportDir, s.Screenshot)} src={getScreenshotUrl(reportDir, s.Screenshot)} />

                <Card.Content className="mt3">
                  {s.Message &&
                    <Label size='tiny' basic color="orange">
                      {s.Message}
                    </Label>
                  }
                </Card.Content>
                {
                  s.CodeStack.length > 0 &&
                    <Card.Content extra>
                      <div className="mt1">
                        <Collapsible className="mt2" label="Source">
                          <small>
                            {
                              s.CodeStack.map((cs, i) =>
                                <SourceCodeSnippet key={i} code={cs.Source} location={cs.Location} />
                              )
                            }
                            <pre>
                              <code>
                                {s.OrgStack}
                              </code>
                            </pre>
                          </small>
                        </Collapsible>
                      </div>
                  </Card.Content>
                }
              </Card.Content>
            </Card>
      )
    }
    </Card.Group>
  </div>


const RecentFailures = ({ownerkey, hashcategory, failedReports}) =>
  <div className="RecentFailures mt4">
    <h3>Other failures on this device ({failedReports.length})</h3>
    <Card.Group itemsPerRow={MAX_RECENT_FAILURES}>
    {
      failedReports.map((r, i) =>
        <Card key={i} color='orange'>
          <Card.Content>
            <Image
              as='a'
              size='tiny'
              floated='right'
              href={`/details?ownerkey=${ownerkey}&hashcategory=${hashcategory}&id=${r._id}`}
              target='_blank'
              src={getScreenshotUrl(r.ReportDir, r.Screenshots[0].Screenshot)} />
            <Card.Meta>
              <div>
                {r.Screenshots[0].Page.Title}
              </div>
              <small className='date'>
                {moment(r.Screenshots[0].ShotAt).fromNow()}
              </small>
              <small className='date'>
                {r.Duration}s
              </small>
            </Card.Meta>
            <Card.Description>
              <strong className="f6">
                <CommandName
                  screenshot={r.Screenshots[0]}
                  steps={r.Outline.Steps} />
              </strong>

              { r.Screenshots[0].Message &&
                <Label size='medium' basic color="orange" title={r.Screenshots[0].Message}>
                  {trunc(r.Screenshots[0].Message)}
                </Label>
              }

              <div className="mt1">
                <Collapsible className="mt2" label="Details">
                  <small>
                    <SourceCodeSnippet code={r.Screenshots[0].CodeStack[0].Source} location={r.Screenshots[0].CodeStack[0].Location} />
                  </small>
                </Collapsible>
              </div>

              </Card.Description>
          </Card.Content>
        </Card>
      )
    }
    </Card.Group>
  </div>


const ResultIcon = ({step}) => {
  if (step.Success === true)
    return <List.Icon color="green" name="checkmark" />
  if (step.Success === false && step.ReachedAt > 0)
    return <List.Icon color="orange" name="remove" />
  return <List.Icon color="grey" name="circle" />
}


const Steps = ({steps, errorMessage}) =>
    <div>
      <h3>Steps</h3>
      <List>
      {
        steps.map((step, i) =>
        <List.Item key={i}>
          <ResultIcon step={step} />
          <List.Content>
            {step.ActualName || step.Name}

            {
              step.Success === false && step.ReachedAt > 0 &&
                <div className="cf mt2 courier orange ba pa1">
                  <strong>
                    {errorMessage}
                  </strong>
                </div>
            }

          </List.Content>
        </List.Item>
        )
      }
      </List>
    </div>


const Meta = ({ownerkey, project, report, history}) =>
  <div className="Headline-details black-60 cf">
    <strong>
      {moment(report.StartedAt).format("ddd, hA")} ({moment(report.StartedAt).fromNow()})
    </strong>
    &nbsp;
    &middot;
    &nbsp;
    <span>
      {report.Prefix}
    </span>

    <span className="Headline-successesAndFailures fr">
      <SuccessesAndFailuresBars
        selectedBar={indexOfReport(report, history)}
        data={mapToSuccessAndFailure(history, ownerkey, project)}
        maxBars={50}
      />
    </span>
  </div>


export default class extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, id, hashcategory } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    // TODO: To optimize could pass in hashcategory instead of id
    const report = await getReportById(id)

    // TODO Fix project when project is #All
    let historicReports = await getReportsByCategory(hashcategory, {limit: 10, since: report.StartedAt, ownerkey})

    // TODO Rethink this
    let lastSuccessScreenshotOfReport

    if (historicReports === null) historicReports = []

    const failedReports = historicReports
      .filter(r => r.Result === 'error')
      .filter(r => r.DeviceSettings.Type === report.DeviceSettings.Type)
      .slice(0, MAX_RECENT_FAILURES)

    return { ownerkey, project, report, historicReports, failedReports, lastSuccessScreenshotOfReport }
  }

  render () {
    const attrs = {title: `${this.props.report.Title}`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <div className="mt4">
          <Meta
            ownerkey={this.props.ownerkey}
            project={this.props.project}
            report={this.props.report}
            history={this.props.historicReports} />

          <Header as='h2'>
            <TestResultDeviceIcon
              result={this.props.report.Result}
              deviceSettings={this.props.report.DeviceSettings} />
            &nbsp;
            {this.props.report.Title}
          </Header>

          {
            this.props.report.Outline.Steps.length > 0 &&
              <Steps
                steps={this.props.report.Outline.Steps}
                errorMessage={this.props.report.Screenshots[0] && this.props.report.Screenshots[0].Message} />
          }


          {
            this.props.failedReports.length > 0 &&
              <RecentFailures
                ownerkey={this.props.ownerkey}
                hashcategory={this.props.report.Hashcategory}
                reportDir={this.props.report.ReportDir}
                failedReports={this.props.failedReports} />
          }

          <Timeline
            reportDir={this.props.report.ReportDir}
            steps={this.props.report.Outline.Steps}
            startTimeline={this.props.report.StartedAt}
            lastSuccessScreenshotOfReport={this.props.lastSuccessScreenshotOfReport}
            timeline={this.props.report.Screenshots} />
        </div>
      </Layout>
    )
  }
}
