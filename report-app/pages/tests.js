import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import Layout from '../components/layout'

import FileIcon from 'react-icons/lib/fa/file-text'
import TestReportList from '../components/test-report-list'

import getReportGroups from '../services/get-report-groups'
import getDeployments from '../services/get-deployments'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query }) {
    const ownerkey = query.ownerkey
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const project = query.project
    const [tests, deployments] = await Promise.all([getReportGroups(ownerkey, project), getDeployments()])

    return { ownerkey, project, tests, deployments }
  }

  render () {
    return (
      <Layout title="Test Report">
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
        <TestReportList reports={this.props.tests.failed} />

        {
          this.props.tests.succeeded.length > 0 ?
          <h4>
            All Tests
            ({Object.keys(this.props.tests.succeeded).length})
          </h4>
          : null
        }
        <TestReportList deployments={this.props.deployments} reports={this.props.tests.succeeded} />
      </Layout>
    )
  }
}
