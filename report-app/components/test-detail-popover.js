import QuestionIcon from 'react-icons/lib/fa/question-circle'

import Popover from './popover'
import SourceCodeSnippet from './SourceCodeSnippet'

const screenshotUrl = (path, filename) => `/api/screenshots/${encodeURIComponent(path)}/${encodeURIComponent(filename)}`

export default ({ testPath, lastScreenshot }) =>
  lastScreenshot.failed ?
    <Popover Icon={QuestionIcon}>
      <h4 className="mv0 mb2 light-red">
        {lastScreenshot.message}
      </h4>

      <img className="db" src={screenshotUrl(testPath, lastScreenshot.screenshot)} alt={lastScreenshot.screenshot} />

      <SourceCodeSnippet code={lastScreenshot.codeStack[0].source} location={lastScreenshot.codeStack[0].location} />

      <code className="f7 mb3">
        {lastScreenshot.orgStack}
      </code>

    </Popover>
  : null
