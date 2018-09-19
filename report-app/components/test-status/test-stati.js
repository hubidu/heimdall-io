import React from 'react'
import { FaCheck as TestIcon, FaFileAlt as FeatureIcon } from 'react-icons/fa';

import TestResultsByEnv from './test-results-by-env'

import TestTags from '../test-tags'

import splitAndCapitalize from '../../services/utils/split-and-capitalize'
import trunc from '../../services/utils/trunc'


// const getLatestReport = (reports, env) => {
//   function byStartedAtDesc(a, b) {
//     return b.startedAt - a.startedAt
//   }

//   const keys = Object.keys(reports).filter(k => env === undefined || k.indexOf(env) >= 0)
//   const allReports = keys.reduce((agg, key) => {
//     agg.push(reports[key][0])
//     return agg
//   }, [])

//   return allReports.sort(byStartedAtDesc)[0]
// }

const convertToPath = prefix => prefix && prefix.replace(/ -- /g, '/')
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
      <div key={i} id={prefix} className="TestStatus">
        <h4 className="TestStatus-featureTitle">
          <FeatureIcon/> {splitAndCapitalize(extractFeatureName(prefix))}
        </h4>
        <p className="is-size-7 has-text-grey-light">
          {convertToPath(prefix)}
        </p>
        <hr/>
        {
          status[prefix].map((ts, i) => {
            return (
              <div key={i} className="columns">
                <div className="column is-8 is-narrow">
                  <span className="TestStatus-scenarioTitle">
                    <TestIcon /> {ts.title}
                  </span>
                  {
                    ts.data &&
                      <div className="is-size-7 has-text-primary is-hidden-mobile">
                        {trunc(ts.data, 120)}
                      </div>
                  }
                  <TestTags tags={ts.tags} />

                </div>
                <div className="column is-narrow">
                  <TestResultsByEnv ownerkey={ownerkey} reports={ts.reports} />
                </div>
              </div>
            )
          })
        }
        <style jsx>{`
          .TestStatus hr {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .TestStatus-featureTitle {
            margin-top: 2rem;
            font-weight: bold;
            font-size: 1.0rem;
          }

          .TestStatus-scenarioTitle {
            font-size: 1.0rem;
          }
        `}</style>
      </div>
    )
  }
  </div>
