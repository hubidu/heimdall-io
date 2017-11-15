import moment from 'moment'

import TestDetailPopover from '../components/test-detail-popover'
import TestBrowserlogPopover from '../components/test-browserlog-popover'
import TestOutlinePopover from '../components/test-outline-popover'
import TestResultDeviceIcon from '../components/test-result-device-icon'

const getFailedStepName = steps => {
  const failedStep = steps.find(step => step.Success === false)
  if (failedStep) {
    return failedStep.Name;
  }
}

export default ({reports}) =>
  <div className="TestReportGroups">
  {
    reports.map((reportGroup, i) =>
      <div key={i} className="shadow-4 pa1">
        <div className="cf cf-ns nl2 nr2 pv1">
          <div className="fl-ns w-10-ns ph2">
            <TestResultDeviceIcon result={reportGroup.LastReport.Result} deviceSettings={reportGroup.LastReport.DeviceSettings} />
        </div>
          <div className="fl-ns w-70-ns ph2 f6 ">
            <h4 className="ma0 pa1">
              {reportGroup.Title}
            </h4>
              {
                reportGroup.LastReport.Result === 'error' ?
                <div className="black-40">
                  at step
                  &nbsp;
                  <span className="orange">
                  "
                    {getFailedStepName(reportGroup.LastReport.Outline.Steps)}
                  "
                  </span>
                </div>
                : null
              }
          </div>
          <div className="fl-ns w-20-ns ph2 f7">
            <div>
              {moment(reportGroup.LastReport.Started).fromNow()}
            </div>
          </div>
        </div>

        <div className="cf cf-ns nl2 nr2 f7 pv1">
          <div className="fl-ns w-10-ns ph2">
          {reportGroup.LastReport.DeviceSettings.Type}/{reportGroup.LastReport.DeviceSettings.Name}
          </div>
          <div className="fl-ns w-70-ns ph2">
              &nbsp;
          </div>
          <div className="fl-ns w-20-ns ph2">
          {reportGroup.LastReport.Duration}s
          |
          <TestBrowserlogPopover browserLog={reportGroup.LastReport.Logs} />
          &nbsp;
          |
          <TestOutlinePopover testTitle={reportGroup.LastReport.Title} outline={reportGroup.LastReport.Outline} />

          <TestDetailPopover
          testPath={reportGroup.LastReport.ReportDir}
          lastScreenshot={reportGroup.LastReport.Screenshots[0]}
          ></TestDetailPopover>

          </div>
        </div>

      </div>
    )
  }
  </div>
