import React from 'react'
import Layout from '../components/layout'

import TestReportList from '../components/test-report-list'
import TestResultMeter from '../components/test-result-meter'

import getReportGroups from '../services/get-report-groups'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query: { ownerkey, project, runid } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const [tests] = await Promise.all([
        getReportGroups(ownerkey, project, runid),
    ])

    return { ownerkey, project, tests }
  }

  render () {
    const attrs = {title: `Project ${this.props.project}`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <h1 className="title">
            Project {this.props.project}
          </h1>
          <h2 className="subtitle">
            Owner: {this.props.ownerkey}. Your recent test results.
          </h2>

          <TestResultMeter
            errorPct={this.props.tests.failed.length * 100.0 / (this.props.tests.succeeded.length)}
          />

          {
            this.props.tests.failed.length > 0 ?
            <h5 className="title is-5">
            Tests that failed recently&nbsp;
             <span className="tag is-danger">
                {Object.keys(this.props.tests.failed).length}
              </span>
            </h5>
            : null
          }
          {
            // List failed tests first
          }
          <TestReportList
            ownerkey={this.props.ownerkey}
            project={this.props.project}
            reports={this.props.tests.failed}
            showErrors={true}
          />

          {
            this.props.tests.succeeded.length > 0 ?
            <h5 className="title is-5" style={{'marginTop': '10px'}}>
              All tests&nbsp;
              <span className="tag is-dark">
                {Object.keys(this.props.tests.succeeded).length}
              </span>
            </h5>
            : null
          }
          {
            // Then list all the tests (sorted by execution date)
          }
          <TestReportList
            ownerkey={this.props.ownerkey}
            project={this.props.project}
            reports={this.props.tests.succeeded} />

          </div>

      </Layout>
    )
  }
}
