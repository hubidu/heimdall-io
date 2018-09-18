import moment from 'moment'

import LinkToTest from './link-to-test'

import round from '../../services/utils/round'

const color = result => result === 'error' ? 'TestResultForEnv--error' : 'TestResultForEnv--success'

const getLatestReport = reports => reports && reports.length > 0 && reports[0]
const getReportsByEnv = reports => {
  const keys = Object.keys(reports)
  const productionReports = reports[keys.find(k => k.indexOf('production_') >= 0)]
  const stagingReports = reports[keys.find(k => k.indexOf('staging_') >= 0)]
  const integrationReports = reports[keys.find(k => k.indexOf('integration_') >= 0 || k.indexOf('test_') >= 0)]
  const developmentReports = reports[keys.find(k => k.indexOf('development_') >= 0)]

  return {
    productionReports,
    stagingReports,
    integrationReports,
    developmentReports
  }
}

const TestResultForEnv = ({ownerkey, reports, env}) => {
  const latestReport = getLatestReport(reports)
  if (!latestReport) return <div/>
  return (
    <div className={`TestResultForEnv has-text-centered is-size-7`}>
      <div>
        <LinkToTest ownerkey={ownerkey} project={latestReport.project} reportId={latestReport.reportId} hashcategory={latestReport.hashcategory}>
          <small className={`${color(latestReport.result)}`}>
            {env}
          </small>
        </LinkToTest>
      </div>
      <div>
        <div>
          {moment(latestReport.startedAt).fromNow()}
        </div>
        <div>
          {round(latestReport.duration)}s
        </div>
      </div>
      <style jsx>{`
      .TestResultForEnv--error {
        font-size: 0.7rem;
        padding: 2px 4px;
        color: hsl(348, 100%, 61%);
        border: 1px solid hsl(348, 100%, 61%);
        border-radius: 3px;
      }
      .TestResultForEnv--success {
        font-size: 0.7rem;
        padding: 2px 4px;
        color: hsl(141, 71%, 48%);
        border: 1px solid hsl(141, 71%, 48%);
        border-radius: 3px;
      }
      `}</style>

    </div>
  )
}

export default ({ownerkey, reports}) => {
    const { productionReports, stagingReports, integrationReports, developmentReports } = getReportsByEnv(reports)

    return (
      <table className="table is-narrow is-fullwidth">
        <tbody>
        <tr>
          <td>
          {
            productionReports &&
              <div className="column">
                <TestResultForEnv
                  ownerkey={ownerkey}
                  reports={productionReports}
                  env={'production'}
                />
              </div>
          }
          </td>
          <td>
            {
              stagingReports &&
                <div className="column">
                  <TestResultForEnv
                    ownerkey={ownerkey}
                    reports={stagingReports}
                    env={'staging'}
                  />
                </div>
            }
          </td>
          <td>
            {
              integrationReports &&
                <div className="column">
                  <TestResultForEnv
                    ownerkey={ownerkey}
                    reports={integrationReports}
                    env={'integration'}
                  />
                </div>
            }
          </td>
          <td>
            {
              developmentReports &&
                <div className="column">
                  <TestResultForEnv
                    ownerkey={ownerkey}
                    reports={developmentReports}
                    env={'development'}
                  />
                </div>
            }
          </td>
        </tr>

        </tbody>
      </table>
    )
}
