import QuestionIcon from 'react-icons/lib/fa/question-circle'

import Popover from './popover'
import SourceCodeSnippet from './SourceCodeSnippet'
import getScreenshotUrl from '../services/get-sceenshot-url'


export default ({ testPath, lastScreenshot }) =>
  lastScreenshot.Success === false ?
    <Popover Icon={QuestionIcon}>
      <h4 className="mv0 mb2 light-red">
        {lastScreenshot.Message}
      </h4>

      <div className={'black-50 mt1'}>
        {lastScreenshot.Page.Url}
      </div>
      <img className="db" src={getScreenshotUrl(testPath, lastScreenshot.Screenshot)} alt={lastScreenshot.Screenshot} />

      {
        lastScreenshot.CodeStack.length > 0 &&
          <SourceCodeSnippet code={lastScreenshot.CodeStack[0].Source} location={lastScreenshot.CodeStack[0].Location} />
      }

      <code className="f7 mb3">
        {lastScreenshot.OrgStack}
      </code>

    </Popover>
  : null
