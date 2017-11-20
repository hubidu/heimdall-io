import React from 'react'
import{Header, Label, Item} from 'semantic-ui-react'

import Layout from '../components/layout'
import SourceCodeSnippet from '../components/SourceCodeSnippet'

import getReportById from '../services/get-report-by-id'
import getScreenshotUrl from '../services/get-sceenshot-url'

const AtSecond = ({shotAt, startShotAt}) =>
  <span>
    {(shotAt - startShotAt) / 1000}
  </span>

const ResultIcon = ({report}) =>
  report.Result === 'success' ?
    <Label as='a' color='green' ribbon>Succeeded</Label>
    : <Label as='a' color='red' ribbon>Failed</Label>

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

export default class extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)
    return { report }
  }

  render () {
    return (
      <Layout title="Test Report">

        <Header as='h2'>
          <ResultIcon report={this.props.report} />
          {this.props.report.Title}
          <Header.Subheader>
            {this.props.report.Prefix}
          </Header.Subheader>
        </Header>

        <Item.Group divided>
        {
          this.props.report.Screenshots.map((s, i) =>
          <Item>
            <Item.Image src={getScreenshotUrl(this.props.report.ReportDir, s.Screenshot)} />
            <Item.Content>
              <Item.Header as='a'>
                <CommandName codeStack={s.CodeStack} />
              </Item.Header>
              <Item.Meta>
                at second <AtSecond shotAt={s.ShotAt} startShotAt={this.props.report.Screenshots[this.props.report.Screenshots.length - 1].ShotAt} />
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
      </Layout>
    )
  }
}
