import React from 'react'

import Layout from '../components/layout'
import TestReportList from '../components/test-report-list'

import getReportGroups from '../services/get-report-groups'
import getDeployments from '../services/get-deployments'

export default class IndexPage extends React.Component {
  static async getInitialProps () {
    // const tests = await getReportGroups()
    // const deployments = await getDeployments()

    const results = await Promise.all([getReportGroups(), getDeployments()])

    return { tests: results[0], deployments: results[1] }
  }

  render () {
    return (
      <Layout title="Test Report">
        {
          this.props.tests.failed.length > 0 ?
          <h3>
            Failed tests
            ({Object.keys(this.props.tests.failed).length})
          </h3>
          : null
        }
        <TestReportList reports={this.props.tests.failed} />

        {
          this.props.tests.succeeded.length > 0 ?
          <h3>
            All Tests
            ({Object.keys(this.props.tests.succeeded).length})
          </h3>
          : null
        }
        <TestReportList deployments={this.props.deployments} reports={this.props.tests.succeeded} />
      </Layout>
    )
  }
}
