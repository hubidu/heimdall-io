import TestReportGroup from '../components/test-report-group'

export default ({ownerkey, project, reports, showErrors = false}) => {
  const bySortKey = (a, b) => {
    return a.SortKey - b.SortKey
  }
  const desc = sortFn => (a, b) => -1 * sortFn(a, b)

  return (
    <div>
      { reports && reports.length > 0 &&
        <div className="TestReportGroups box">
        {
          reports.map((event, i) =>
            <TestReportGroup
              key={i}
              ownerkey={ownerkey}
              project={project}
              reportGroup={event}
              showErrors={showErrors}
            />
          )
        }
        </div>
      }
    </div>
)}
