import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import Layout from '../components/layout'

import FileIcon from 'react-icons/lib/fa/file-text'
import TestReportList from '../components/test-report-list'

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
            <FileIcon />
            Project {this.props.project}
          </h1>
          <h2 className="subtitle">
            Owner: {this.props.ownerkey}. Your recent test results.
          </h2>

          <progress className="progress is-success" value={this.props.tests.succeeded.length} max={this.props.tests.succeeded.length + this.props.tests.failed.length}>
            {this.props.tests.succeeded.length} of {this.props.tests.succeeded.length + this.props.tests.failed.length}
          </progress>

          {
            this.props.tests.failed.length > 0 ?
            <h5 className="is-spaced has-text-grey-light">
              <span className="tag is-danger">
              {Object.keys(this.props.tests.failed).length}
              </span>
              &nbsp;tests failed recently
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
            <h5 className="is-spaced has-text-grey-light">
              <span className="tag is-dark">
                {Object.keys(this.props.tests.succeeded).length}
              </span>
              &nbsp; total tests
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
