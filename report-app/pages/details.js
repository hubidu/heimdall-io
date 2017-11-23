import React from 'react'
import{Card, Image, Icon, Header, Label, Item} from 'semantic-ui-react'
import moment from 'moment'

import Layout from '../components/layout'
import SourceCodeSnippet from '../components/SourceCodeSnippet'
import SuccessesAndFailuresBars from '../components/SuccessesAndFailuresBars'

import getReportById from '../services/get-report-by-id'
import getReportsByCategory from '../services/get-reports-by-category'
import getScreenshotUrl from '../services/get-sceenshot-url'

const mapToSuccessAndFailure = historicReports => historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success'
}))

const AtSecond = ({shotAt, startShotAt}) =>
  <span>
    {(shotAt - startShotAt) / 1000}
  </span>

const ResultIcon = ({report}) =>
  report.Result === 'success' ?
    <Label as='a' color='green'>Succeeded</Label>
    : <Label as='a' color='orange'>Failed</Label>

const CommandName = ({codeStack}) =>
  <span>
    {
      codeStack[0].Source.find(src => src.Line === codeStack[0].Location.Line)
        .Value
        .replace('await', '')
        .replace('(', ' (')
        .trim()
    }
  </span>

const color = success => success ? 'green' : 'orange'

const trunc = msg => msg ? msg.substring(0, 50) + '...' : msg

const Timeline = ({reportDir, startTimeline, timeline}) =>
  <div className="Timeline mt4">
    <h2>Timeline</h2>
    <Item.Group divided>
    {
      timeline.map((s, i) =>
      <Item key={i}>
        <Item.Image as='a' size='medium' href={getScreenshotUrl(reportDir, s.Screenshot)} src={getScreenshotUrl(reportDir, s.Screenshot)} />
        <Item.Content>
          <Item.Header>
            <CommandName codeStack={s.CodeStack} />
          </Item.Header>
          <Item.Meta>
            at second <AtSecond shotAt={s.ShotAt} startShotAt={startTimeline} />
          </Item.Meta>
          <Item.Meta>
            <a href={s.Page.Url}>{s.Page.Title}</a>
          </Item.Meta>
          <Item.Meta>
          { s.Message &&
            <Label size='medium' basic color="orange">
              {s.Message}
            </Label>
          }
          </Item.Meta>
          <Item.Description>
            <small>
              <SourceCodeSnippet key={i} code={s.CodeStack[0].Source} location={s.CodeStack[0].Location} />
            </small>
          </Item.Description>
          <Item.Extra>
            { s.Success === false &&
              <span>
                <pre>
                  <code>
                    {s.OrgStack}
                  </code>
                </pre>

              </span>
            }
          </Item.Extra>
        </Item.Content>
      </Item>
      )
    }
    </Item.Group>
  </div>


const RecentFailures = ({failedReports}) =>
  <div className="RecentFailures mt4">
    <h2>Recent failures</h2>
    <Card.Group itemsPerRow={4}>
    {
      failedReports.map((r, i) =>
        <Card key={i} color='orange'>
          <Image size='small' centered src={getScreenshotUrl(r.ReportDir, r.Screenshots[0].Screenshot)} />
          <Card.Content>
            <Card.Meta>
              <small className='date'>
                {moment(r.Screenshots[0].ShotAt).fromNow()}
              </small>
              <small className='date'>
                {r.Duration}s
              </small>
              <small>
                {r.Screenshots[0].Page.Title}
             </small>

            </Card.Meta>
            <Card.Description>
              <CommandName codeStack={r.Screenshots[0].CodeStack} />

              { r.Screenshots[0].Message &&
                <Label size='medium' basic color="orange" title={r.Screenshots[0].Message}>
                  {trunc(r.Screenshots[0].Message)}
                </Label>
              }

              <small>
                <SourceCodeSnippet code={r.Screenshots[0].CodeStack[0].Source} location={r.Screenshots[0].CodeStack[0].Location} />
              </small>

              <a target="_blank" href={`/details?id=${r._id}`}>Details...</a>

              </Card.Description>
          </Card.Content>
        </Card>
      )
    }
    </Card.Group>
  </div>

export default class extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)
    const historicReports = await getReportsByCategory(report.HashCategory)
    const failedReports = historicReports
                            .filter(r => r.Result !== 'success')
                            .filter(r => r.DeviceSettings.Name === report.DeviceSettings.Name)
                            .slice(1, 5)

    console.log(report, failedReports)
    return { report, historicReports, failedReports }
  }

  render () {
    return (
      <Layout title="Test Report">
        <div className="mt4">
          <Header as='h2' dividing>
            {this.props.report.Title}
          </Header>

          <div className="black-60">
            <small>
              {this.props.report.Prefix}
            </small>
          </div>
          <ResultIcon report={this.props.report} />
          &nbsp;
          <Label as='a' >{this.props.report.DeviceSettings.Type} / {this.props.report.DeviceSettings.Name}</Label>
          &nbsp;
          {moment(this.props.report.StartedAt).fromNow()}
          <span className="fr mt1">
            <SuccessesAndFailuresBars
            data={mapToSuccessAndFailure(this.props.historicReports)}
            maxBars={50}
            />
          </span>

          {
            this.props.failedReports.length > 0 &&
              <RecentFailures reportDir={this.props.report.ReportDir} failedReports={this.props.failedReports} />
          }

          <Timeline
            reportDir={this.props.report.ReportDir}
            startTimeline={this.props.report.Screenshots[this.props.report.Screenshots.length - 1].ShotAt}
            timeline={this.props.report.Screenshots} />
        </div>
      </Layout>
    )
  }
}
