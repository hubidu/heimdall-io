import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import Layout from '../components/layout'

import FileIcon from 'react-icons/lib/fa/file-text'
import TestReportList from '../components/test-report-list'

import getReportGroups from '../services/get-report-groups'
import getDeployments from '../services/get-deployments'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, runid } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const [tests, deployments] = await Promise.all([getReportGroups(ownerkey, project, runid), getDeployments()])

    return { ownerkey, project, tests, deployments }
  }

  render () {
    const attrs = {title: `Project ${this.props.project}`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <Header as='h2'>
          <FileIcon />
          Project {this.props.project}
          <Header.Subheader>
            Recent test results
          </Header.Subheader>
        </Header>
        {
          this.props.tests.failed.length > 0 ?
          <h4>
            Failed tests
            ({Object.keys(this.props.tests.failed).length})
          </h4>
          : null
        }
        <TestReportList
          ownerkey={this.props.ownerkey}
          project={this.props.project}
          reports={this.props.tests.failed} />

        {
          this.props.tests.succeeded.length > 0 ?
          <h4>
            All Tests
            ({Object.keys(this.props.tests.succeeded).length})
          </h4>
          : null
        }
        <TestReportList
          ownerkey={this.props.ownerkey}
          project={this.props.project}
          deployments={this.props.deployments}
          reports={this.props.tests.succeeded} />
      </Layout>
    )
  }
}
