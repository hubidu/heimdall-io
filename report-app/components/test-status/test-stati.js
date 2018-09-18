import React from 'react'
import Link from 'next/link'

import moment from 'moment'

import TestTags from '../test-tags'
import TestResultIcon from '../test-result-icon'

import trunc from '../../services/utils/trunc'
import round from '../../services/utils/round'
import linkToReportDetails from '../../services/utils/link-to-report-details'


const getLatestReport = (reports, env) => {
  function byStartedAtDesc(a, b) {
    return b.startedAt - a.startedAt
  }

  const keys = Object.keys(reports).filter(k => env === undefined || k.indexOf(env) >= 0)
  const allReports = keys.reduce((agg, key) => {
    agg.push(reports[key][0])
    return agg
  }, [])

  return allReports.sort(byStartedAtDesc)[0]
}

const extractFeatureName = prefix => {
  const parts = prefix.split('--').map(p => p.trim())
  return parts[parts.length - 1]
}

const color = result => result === 'error' ? 'tag is-danger' : 'tag is-success'

const TestResultForEnv = ({startedAt, duration, reports, env}) => {
  const latestReport = getLatestReport(reports, env)
  if (!latestReport) return <div/>
  return (
    <div className={`TestResultForEnv`}>
      <div className={`${color(latestReport.result)} is-small`}>
        <small>
          {env}
        </small>
      </div>
    </div>
  )
}

export default ({ ownerkey, status }) =>
  <div>
  {
    Object.keys(status)
    .sort()
    .map((prefix, i) =>
      <div key={i} id={prefix} className="TestStatus box">
        <strong className="is-size-5">
          {extractFeatureName(prefix)}
        </strong>
        <hr/>
        {
          status[prefix].map((ts, i) => {
            const latestReport = getLatestReport(ts.reports)

            return (
              <div key={i} className="columns">
                <div className="column is-1">
                  <TestResultForEnv startedAt={latestReport.startedAt} duration={latestReport.duration} reports={ts.reports} env={'production'} />
                  <TestResultForEnv startedAt={latestReport.startedAt} duration={latestReport.duration} reports={ts.reports} env={'staging'} />
                  <TestResultForEnv startedAt={latestReport.startedAt} duration={latestReport.duration} reports={ts.reports} env={'integration'} />
                  <TestResultForEnv startedAt={latestReport.startedAt} duration={latestReport.duration} reports={ts.reports} env={'test'} />
                  <TestResultForEnv startedAt={latestReport.startedAt} duration={latestReport.duration} reports={ts.reports} env={'development'} />
                </div>
                <div className="column is-8">
                    <Link href={linkToReportDetails(ownerkey, latestReport.project, latestReport.reportId, ts.hashcategory)}>
                    <a>
                      <b className="has-text-dark is-size-6">{ts.title}</b>
                    </a>
                  </Link>
                  {
                    ts.data &&
                      <div className="is-size-7 has-text-primary is-hidden-mobile">
                        {trunc(ts.data, 120)}
                      </div>
                  }
                  <TestTags tags={ts.tags} />

                </div>
                <div className="column">
                  <span>at</span>&nbsp;<strong>{moment(ts.modifiedAt).format('ddd, H:mm')}</strong>
                  &nbsp;&middot;&nbsp;
                  <span>in</span>&nbsp;<strong>{round(latestReport.duration)} s</strong>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
  </div>
