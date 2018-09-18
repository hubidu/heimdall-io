import React from 'react'

import TestResultsByEnv from './test-results-by-env'

import TestTags from '../test-tags'

import splitAndCapitalize from '../../services/utils/split-and-capitalize'
import trunc from '../../services/utils/trunc'


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

export default ({ ownerkey, status }) =>
  <div>
  {
    Object.keys(status)
    .sort()
    .map((prefix, i) =>
      <div key={i} id={prefix} className="TestStatus box">
        <strong className="is-size-5">
          {splitAndCapitalize(extractFeatureName(prefix))}
        </strong>
        <hr/>
        {
          status[prefix].map((ts, i) => {
            return (
              <div key={i} className="columns">
                <div className="column is-8">
                  {ts.title}
                  {
                    ts.data &&
                      <div className="is-size-7 has-text-primary is-hidden-mobile">
                        {trunc(ts.data, 120)}
                      </div>
                  }
                  <TestTags tags={ts.tags} />

                </div>
                <div className="column">
                  <TestResultsByEnv ownerkey={ownerkey} reports={ts.reports} />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
  </div>
