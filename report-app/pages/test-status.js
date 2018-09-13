import React from 'react'
import Layout from '../components/layout'


import TestResultIcon from '../components/test-result-icon'

import getTestStatus from '../services/get-test-status'

const groupByPrefix = testStatus => {
  return testStatus.reduce((agg, ts) => {
    if (agg[ts.prefix] === undefined) {
      agg[ts.prefix] = []
    }
    agg[ts.prefix].push(ts)
    return agg
  }, {})
}

function byStartedAtDesc(a, b) {
  return b.startedAt - a.startedAt
}

const getLatestReport = testStatus => {
  const keys = Object.keys(testStatus.reports)
  const allReports = keys.reduce((agg, key) => {
    agg.push(testStatus.reports[key][0])
    return agg
  }, [])

  return allReports.sort(byStartedAtDesc)[0]
}

export default class TestStatusPage extends React.Component {
  static async getInitialProps ({ query: { ownerkey } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const testStatus = await getTestStatus(ownerkey)
    const groupedByPrefix = groupByPrefix(testStatus)

    return { ownerkey, testStatus, groupedByPrefix }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    const attrs = {title: `Test Status of ${this.props.ownerkey}`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <h1 className="title">
            Test Status
          </h1>
          <h2 className="subtitle">
            Owner: {this.props.ownerkey}.
          </h2>

          {
            Object.keys(this.props.groupedByPrefix)
            .sort()
            .map(prefix =>
              <div className="box">
                <h3 className="title is-6">
                  {prefix}
                </h3>
                <div>
                  {
                    this.props.groupedByPrefix[prefix].map(ts =>
                      <div>
                        <TestResultIcon result={getLatestReport(ts).result} />
                        {ts.title}
                      </div>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
      </Layout>
    )
  }
}
