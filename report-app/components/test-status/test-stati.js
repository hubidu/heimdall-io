import React from 'react'
import Link from 'next/link'

import moment from 'moment'

import TestResultIcon from '../test-result-icon'

import round from '../../services/utils/round'
import linkToReportDetails from '../../services/utils/link-to-report-details'


const getLatestReport = testStatus => {
  function byStartedAtDesc(a, b) {
    return b.startedAt - a.startedAt
  }

  const keys = Object.keys(testStatus.reports)
  const allReports = keys.reduce((agg, key) => {
    agg.push(testStatus.reports[key][0])
    return agg
  }, [])

  return allReports.sort(byStartedAtDesc)[0]
}

export default ({ ownerkey, status }) =>
  <div>
  {
    Object.keys(status)
    .sort()
    .map((prefix, i) =>
      <div key={i} className="box">
        <span className="has-text-grey">
          {prefix}
        </span>
        {
          status[prefix].map((ts, i) => {
            const latestReport = getLatestReport(ts)

            return (
              <div key={i} className="columns">
                <div className="column is-8">
                  <TestResultIcon result={latestReport.result} />
                  &nbsp;

                  <Link href={linkToReportDetails(ownerkey, latestReport.project, latestReport.reportId, ts.hashcategory)}>
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
