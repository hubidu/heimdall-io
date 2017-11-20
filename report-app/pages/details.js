import React from 'react'
import{Header, Label, Item} from 'semantic-ui-react'
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
    : <Label as='a' color='red'>Failed</Label>

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

const Timeline = ({reportDir, startTimeline, timeline}) =>
  <Item.Group divided>
  {
    timeline.map((s, i) =>
    <Item key={i}>
      <Item.Image src={getScreenshotUrl(reportDir, s.Screenshot)} />
      <Item.Content>
        <Item.Header as='a'>
          <CommandName codeStack={s.CodeStack} />
        </Item.Header>
        <Item.Meta>
          at second <AtSecond shotAt={s.ShotAt} startShotAt={startTimeline} />
        </Item.Meta>
        <Item.Meta>
          <a href={s.Page.Url}>{s.Page.Title}</a>
        </Item.Meta>
        <Item.Description>
          <SourceCodeSnippet key={i} code={s.CodeStack[0].Source} location={s.CodeStack[0].Location} />
        </Item.Description>
        <Item.Extra>
          { s.Success === false &&
            <span>
              <Label color="red">
                {s.Message}
              </Label>
              <br/>
              <verbatim>
              <code>
                {s.OrgStack}
              </code>
              </verbatim>

            </span>
          }
        </Item.Extra>
      </Item.Content>
    </Item>
    )
  }
  </Item.Group>


export default class extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)
    const historicReports = await getReportsByCategory(report.HashCategory)
    return { report, historicReports }
  }

  render () {
    return (
      <Layout title="Test Report">
        <Header as='h2' dividing>
          {this.props.report.Title}
          <Header.Subheader>
            {this.props.report.Prefix}
          </Header.Subheader>
        </Header>

        <ResultIcon report={this.props.report} />
        &nbsp;
        {moment(this.props.Started).fromNow()}
        &nbsp;
        <Label as='a' >{this.props.report.DeviceSettings.Type} / {this.props.report.DeviceSettings.Name}</Label>
        <span className="fr mt1">
          <SuccessesAndFailuresBars
          data={mapToSuccessAndFailure(this.props.historicReports)}
          maxBars={50}
          />
        </span>

        <Timeline
          reportDir={this.props.report.ReportDir}
          startTimeline={this.props.report.Screenshots[this.props.report.Screenshots.length - 1].ShotAt}
          timeline={this.props.report.Screenshots} />
      </Layout>
    )
  }
}
