import TestReportGroup from '../components/test-report-group'
import DeploymentEvent from '../components/deployment-event'

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
        return <DeploymentEvent key={i} event={event} />
      } else {
        return <TestReportGroup key={i} reportGroup={event} deployments={deployments} />
      }
    })
  }
  </div>
  )
}
