import TerminalIcon from 'react-icons/lib/fa/terminal'

import Popover from './popover'

export default ({ browserLog }) =>
  browserLog && browserLog.length > 0 ?
    <Popover Icon={TerminalIcon}>
      <h4 className="mv0 mb2">
        Browserlog
      </h4>

      <code className="f7">
        {
          browserLog.map(logEntry =>
            <span>{logEntry.message}<br/><br/></span>
          )
        }
      </code>

    </Popover>
  : null
