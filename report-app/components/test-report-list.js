import moment from 'moment'
import TestReportGroup from '../components/test-report-group'

export default ({reports, deployments}) => {
  const bySortKey = (a, b) => {
    return a.SortKey - b.SortKey
  }
  const desc = sortFn => (a, b) => -1 * sortFn(a, b)

  const reportsAndDeployments = deployments === undefined ? reports : reports.concat(deployments).sort(desc(bySortKey))

  return (
  <div className="TestReportGroups">
  {
    reportsAndDeployments.map((event, i) => {
      if (event.Type === 'deployment-event') {
        return <div key={i} className="shadow-4 pa1 ma1">
          {moment(event.FinishedAt).format('llll')}
          &nbsp;
          <strong>
            {event.ProjectName}
          </strong>
          &nbsp;
          at {event.Version}
        </div>
      } else {
        return <TestReportGroup key={i} reportGroup={event} />
      }
    })
  }
  </div>
  )
}
