import React from 'react'

import Layout from '../components/layout'
import TestReportList from '../components/test-report-list'

import getReportGroups from '../services/get-report-groups'

export default class IndexPage extends React.Component {
  static async getInitialProps () {
    const tests = await getReportGroups()
    console.log(tests)

    return { tests }
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
            Succeeded Tests
            ({Object.keys(this.props.tests.succeeded).length})
          </h3>
          : null
        }
        <TestReportList reports={this.props.tests.succeeded} />
      </Layout>
    )
  }
}
