import React from 'react'
import Layout from '../components/layout'
import Link from 'next/link'

import moment from 'moment'

import TestResultIcon from '../components/test-result-icon'

import getTestStatus from '../services/get-test-status'

import round from '../services/utils/round'
import linkToReportDetails from '../services/utils/link-to-report-details'

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
            .map((prefix, i) =>
              <div key={i} className="box">
                <span className="has-text-grey">
                  {prefix}
                </span>
                {
                  this.props.groupedByPrefix[prefix].map((ts, i) => {
                    const latestReport = getLatestReport(ts)

                    return (
                      <div key={i} className="columns">
                        <div className="column is-8">
                          <TestResultIcon result={latestReport.result} />
                          &nbsp;

                          <Link href={linkToReportDetails(this.props.ownerkey, latestReport.project, latestReport.reportId, ts.hashcategory)}>
                            <a>
                              <b className="has-text-dark">{ts.title}</b>
                            </a>
                          </Link>
                        </div>
                        <div className="column">
                          <span>at</span>&nbsp;<strong>{moment(ts.modifiedAt).format('ddd, H:mm')}</strong>
                          &nbsp;&middot;&nbsp;
                          <span>in</span>&nbsp;<strong>{round(latestReport.duration)} s</strong>
                          &nbsp;&middot;&nbsp;
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          }
        </div>
      </Layout>
    )
  }
}
