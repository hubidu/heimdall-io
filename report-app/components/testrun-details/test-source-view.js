import TestError from '../test-error'
import TestSourceStacktrace from './test-source-stacktrace'
import HtmlSourceLink from './html-source-link'

import round from '../../services/utils/round'
import filePathSplit from '../../services/utils/filepath-split'
import lastOf from '../../services/utils/last-of'

const firstN = (arr, n = 5) => arr.slice(0, n)

const backgroundColor = meta => {
  if (!meta) return

  if (meta.Success === true) return 'has-background-success'
  if (meta.Success === false) return 'has-background-danger'
  return ''
}

const formatRelTime = (startedAt, meta) => round((meta.ShotAt - startedAt) / 1000, 1)

const hasMetaInfo = line => line.meta
const hasMoreThanOneStackframe = line => line.meta.CodeStack && line.meta.CodeStack.length > 1
const isInRange = (lineRange, lineNo) => lineRange && (lineNo >= lineRange[0] && lineNo <= lineRange[1])
const isFullyInRange = (lineRange, group) => isInRange(lineRange, group.first) && isInRange(lineRange, group.first + group.len)
const isTooLarge = group => group.len > 10

const TestSourceLineGroup = ({ reportId, group, startedAt, selectedLine, lineRange, onClickLine }) =>
  <div className={`TestSourceLineGroup`}>
    { group.isAnnotated === false && !isFullyInRange(lineRange, group) &&
      <div className="TestSourceLineGroup-hiddenPart">
        {firstN(group.lines).map((l, i) =>
          <TestSourceLine
            reportId={reportId}
            key={i}
            selected={false}
            isInRange={isInRange(lineRange, l.lineNo)}
            lineNo={l.lineNo}
            line={l}
          />
        )}

        <div className="TestSourceLineGroup--hidden">{group.lines.length} lines hidden</div>

        <TestSourceLine
          reportId={reportId}
          selected={false}
          isInRange={isInRange(lineRange, lastOf(group.lines).lineNo)}
          lineNo={lastOf(group.lines).lineNo}
          line={lastOf(group.lines)}
        />
      </div>
    }

    {
      (group.isAnnotated || isFullyInRange(lineRange, group)) && group.lines.map((l, i) =>
        <TestSourceLine
        reportId={reportId}
        key={i}
        startedAt={startedAt}
        selected={selectedLine === l.lineNo}
        isInRange={isInRange(lineRange, l.lineNo)}
        lineNo={l.lineNo}
        line={l}
        onClick={(e) => onClickLine && onClickLine(e)}
        />
      )
    }
  <style jsx>{`
  .TestSourceLineGroup {}
  .TestSourceLineGroup--hidden {
    padding-left: 6em;
    margin: 1em 0;
    color: #ddd;
  }
  `}</style>
  </div>


const TestSourceLine = ({ reportId, startedAt, selected = false, isInRange = false, lineNo, line, onClick }) =>
  <div
    className={`TestSourceLine ${hasMetaInfo(line) ? 'TestSourceLine--selectable' : ''} ${selected ? 'TestSourceLine--selected' : ''}`}
    key={lineNo}
    onClick={(e) => onClick &&
       hasMetaInfo(line) &&
       onClick({
      lineNo,
      line
    })}>

    <div className={`${isInRange ? 'has-text-dark' : ''}`}>
      { line.metaDiff ?
        <span className={`TestSourceLine-indicator ${backgroundColor(line.metaDiff)}`}>&nbsp;</span>
        :
        <span className={`TestSourceLine-indicator`}>&nbsp;</span>
      }

      <span className="TestSourceLine-relTime has-text-grey">
        {`${line.meta ? formatRelTime(startedAt, line.meta) : '' }`}
      </span>

      <span className={`TestSourceLine-indicator ${backgroundColor(line.meta)}`}>&nbsp;</span>

      <span className="TestSourceLine-lineNo">
        {lineNo}
      </span>

      <span className={`TestSourceLine-code`}>
        {line.source}
      </span>
    </div>
    {
      hasMetaInfo(line) &&
      line.meta.Success === false &&
        <div className="TestSourceLine-errorBox is-clipped">
          <HtmlSourceLink reportId={reportId} />
          <TestError screenshot={line.meta} />
        </div>
    }
    {
      selected &&
      hasMetaInfo(line) &&
      hasMoreThanOneStackframe(line) &&
        <TestSourceStacktrace stack={line.meta.CodeStack} cmd={line.meta.Cmd} />
    }

    <style jsx>{`
    .TestSourceLine {
      line-height: 1.2em;
    }
    .TestSourceLine-relTime {
      display: inline-block;
      text-align: right;
      width: 3em;
      padding-right: 2px;
      font-size: 0.75em;
    }
    .TestSourceLine--selectable {
      font-weight: bold;
      background-color: #eee;
    }
    .TestSourceLine--selectable:hover {
      cursor: pointer;
      background-color: #ccc;
    }
    .TestSourceLine--selected {
      background-color: #FFFFE0;
    }
    .TestSourceLine-indicator {
      display: inline-block;
      border-radius: 2px;
      width: 1.2em;
      margin: 2px 2px 1px 1px;
      background-color: fafafa;
    }
    .TestSourceLine-lineNo {
      display: inline-block;
      width: 3em;
      color: #ccc;
    }
    .TestSourceLine-code {

    }
    .TestSourceLine-errorBox {
      margin-top: 1em;
      margin-left: 1.3em;
      padding: 5px 1em;
    }
    `}</style>
  </div>


export default ({ reportId, startedAt, filepath, source, selectedLine, lineRange, onClickLine }) =>
  <div>
    <p className="has-text-dark is-size-7">
      <strong>{filePathSplit(filepath).file}</strong>
      <span className="has-text-grey-light"> {filePathSplit(filepath).path}</span>
    </p>
    <pre className="TestSourceView-content has-text-grey-light has-background-white is-size-7">
      <code>
      {
        source.map((lg, i) =>
          <TestSourceLineGroup
            reportId={reportId}
            key={i}
            group={lg}
            startedAt={startedAt}
            selectedLine={selectedLine}
            lineRange={lineRange}
            onClickLine={onClickLine} />
        )
      }
      </code>
    </pre>
    <style jsx>{`
    .TestSourceView-content {
      overflow-x: hidden;
      padding: 0;
    }
    `}</style>
  </div>
