import moment from 'moment'

import TestResultDeviceIcon from '../components/test-result-device-icon'
import TestHistoryBars from '../components/test-history-bars'
import TestError from '../components/test-error'
import TestTitle from '../components/test-title'

import round from '../services/utils/round'

// const mapToSuccessAndFailure = runs => runs.map(run => ({ t: run.StartedAt, value: run.Duration, success: run.Result === 'success'}))
const createTestDetailLink = (id, ownerkey, project, hashcategory) => `/details?ownerkey=${ownerkey}&project=${encodeURIComponent(project)}&id=${id}&hashcategory=${hashcategory}`
const mapToSuccessAndFailure = (historicReports, ownerkey, project) => historicReports ? historicReports.map(r => Object.assign({}, {
  t: r.StartedAt,
  value: r.Duration,
  success: r.Result === 'success',
  href: createTestDetailLink(r._id, ownerkey, project, r.HashCategory)
})) : undefined

export default({ownerkey, project, reportGroup = [], showErrors = false}) =>
  <div className="columns is-1">
    <div className="column is-narrow is-hidden-mobile">
      <TestResultDeviceIcon
        result={reportGroup.LastReport.Result}
        deviceSettings={reportGroup.LastReport.DeviceSettings} />
    </div>
    <div className="column is-7">
      <TestTitle
        ownerkey={ownerkey}
        project={project}
        hashcategory={reportGroup.HashCategory}
        report={reportGroup.LastReport}
      />
      {
        showErrors && reportGroup.LastReport.Screenshots[0] &&
          <div className="is-size-7">
            <TestError screenshot={reportGroup.LastReport.Screenshots[0]} />
          </div>
      }
    </div>
    <div className="column is-hidden-mobile">
      <TestHistoryBars
        data={mapToSuccessAndFailure(reportGroup.Items, ownerkey, project)}
        maxBars={10}
      />
    </div>
    <div className="column is-narrow is-size-7">
      <strong>{moment(reportGroup.LastReport.Started).fromNow()}</strong>
      <br/>
      <span className="has-text-grey-light">in </span>
      {round(reportGroup.LastReport.Duration)} s
    </div>
  </div>

