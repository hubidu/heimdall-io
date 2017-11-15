import moment from 'moment'
import Popover from './popover'

import TestDetailPopover from './test-detail-popover'
import TestBrowserlogPopover from './test-browserlog-popover'
import TestOutlinePopover from './test-outline-popover'
import TestResultIcon from './test-result-device-icon'

export default ({ node }) =>
  <div className="cf nl2 nr2 f6 mt1 shadow-3 pa2 h3">
    <div className="fl-ns w2-ns ph2">
      <TestResultIcon result={node._test.result} deviceSettings={node._test.deviceSettings} />
    </div>
    <div className="fl-ns w-70-ns ph2">
      {node._test.title}
    </div>
    <div className="fl-ns w-10-ns ph2">
      <span className="f7 black-60">{moment(node._test.startedAt).fromNow()}</span>
    </div>
    <div className="fl-ns w-10-ns ph2">

    <TestOutlinePopover testTitle={node._test.title} outline={node._test.outline} />

    <TestDetailPopover
      testPath={node._test.path}
      lastScreenshot={node._test.screenshots[0]}
    >
    </TestDetailPopover>

    <TestBrowserlogPopover
      browserLog={node._test.logs}
    />
  </div>
</div>


