import moment from 'moment'
import TestDetailPopover from '../components/test-detail-popover'
import TestBrowserlogPopover from '../components/test-browserlog-popover'
import TestOutlinePopover from '../components/test-outline-popover'
import TestResultDeviceIcon from '../components/test-result-device-icon'
import SuccessesAndFailuresBars from '../components/SuccessesAndFailuresBars'

const getFailedStepName = steps => {
  const failedStep = steps.find(step => step.Success === false)
  if (failedStep) {
    return failedStep.ActualName || failedStep.Name;
  }
}

const getFailedCommand = screenshot => {
  const codeStack = screenshot.CodeStack
  const line = codeStack[0].Location.Line
  return codeStack[0].Source.find(sourceLine => sourceLine.Line === line)
    .Value.replace('await', '').replace('(', ' (').trim()
}

const trunc = (msg, MaxLen = 80) => {
  let res = msg
  if (msg.length > MaxLen) {
    res = msg.substring(0, MaxLen) + '...'
  }
  return res
}

const mapToSuccessAndFailure = runs => runs.map(run => ({ t: run.StartedAt, value: run.Duration, success: run.Result === 'success'}))
const mapDeploymentsToMarkers = deployments => deployments.map(d => Object.assign({}, { t: d.FinishedAt }))

export default({reportGroup, deployments = []}) =>
<div className="shadow-4 pa1">
  <div className="cf cf-ns nl2 nr2 pv1">
    <div className="fl-ns w-10-ns ph2">
      <TestResultDeviceIcon result={reportGroup.LastReport.Result} deviceSettings={reportGroup.LastReport.DeviceSettings} />
    </div>
    <div className="fl-ns w-60-ns ph2">
      <a href={`/details?id=${reportGroup.LastReport._id}&hashcategory=${reportGroup.HashCategory}`} className="black-80" >
        <h4 className="ma0 pa1 f5">
          {reportGroup.Title}
        </h4>
      </a>
        {
          reportGroup.LastReport.Result === 'error' ?
        <div className="f5">
          <div className="black-40">
            at step
            &nbsp;
            <span className="black-90">
            "
              {getFailedStepName(reportGroup.LastReport.Outline.Steps)}
            "
            </span>
          </div>
          <div className="black-40">
            with
            &nbsp;
            <code className="orange">
              {trunc(reportGroup.LastReport.Screenshots[0].Message)}
            </code>

          </div>
      </div>
          : null
        }
    </div>
    <div className="fl-ns w-20-ns ph2 f7">
    <div>
      <SuccessesAndFailuresBars
        data={mapToSuccessAndFailure(reportGroup.Items)}
        markers={mapDeploymentsToMarkers(deployments)}
        maxBars={20}
        />
      </div>

    </div>
    <div className="fl-ns w-10-ns ph2 f7">
      <div>
        <strong>{moment(reportGroup.LastReport.Started).fromNow()}</strong>
        <span className="black-40">
          &nbsp; in {~~reportGroup.LastReport.Duration}s
        </span>
      </div>

    </div>
  </div>

  <div className="cf cf-ns nl2 nr2 f7 pv1">
    <div className="fl-ns w-10-ns ph2">
    {reportGroup.LastReport.DeviceSettings.Type}/{reportGroup.LastReport.DeviceSettings.Name}
    </div>
    <div className="fl-ns w-80-ns ph2">
        <span className="black-40">
          {reportGroup.LastReport.Prefix.replace(/--/gi, '/')}
        </span>
    </div>
    <div className="fl-ns w-10-ns ph2">
      <TestBrowserlogPopover browserLog={reportGroup.LastReport.Logs} />
      &nbsp;
      <TestOutlinePopover testTitle={reportGroup.LastReport.Title} outline={reportGroup.LastReport.Outline} />
      &nbsp;
      <TestDetailPopover
        testPath={reportGroup.LastReport.ReportDir}
        lastScreenshot={reportGroup.LastReport.Screenshots[0]}
      />

    </div>
  </div>
</div>
