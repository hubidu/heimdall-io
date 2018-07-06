import TestError from '../components/test-error'

const truncLeft = (str, max = 80) => {
  if (str.length <= max) return str
  return '...' + str.slice(str.length - max)
}

const backgroundColor = meta => {
  if (!meta) return

  if (meta.Success === true) return 'has-background-success'
  if (meta.Success === false) return 'has-background-danger'
  return ''
}

const TestSourceLine = ({startedAt, selected, isInRange, lineNo, line, onClick}) =>
  <div
    className={`TestSourceLine ${line.meta ? 'TestSourceLine--selectable' : ''}`}
    key={lineNo}
    onClick={(e) => onClick && line.meta && onClick({
      lineNo,
      line
    })}>

    <div className={`${isInRange ? 'has-text-dark' : ''}`}>
      <span className="TestSourceLine-relTime has-text-grey">
        {`${line.meta ? (line.meta.ShotAt - startedAt) / 1000 : '' }`}
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
      selected && line.meta && line.meta.Success === true &&
        <div className="is-clipped">
        TODO Nothing to show when there is just the test stackframe <br/>
        {line.meta.CodeStack[line.meta.CodeStack.length - 1].Location.File}
        </div>
    }
    {
      line.meta && line.meta.Success === false &&
        <div className="TestSourceLine-errorBox is-clipped">
          <TestError screenshot={line.meta} />
        </div>
    }

    <style jsx>{`
    .TestSourceLine {
      line-height: 1.2em;
    }
    .TestSourceLine-relTime {
      display: inline-block;
      width: 3em;
      font-size: 0.75em;
    }
    .TestSourceLine--selectable {
      font-weight: bold;
    }
    .TestSourceLine--selectable:hover {
      cursor: pointer;
      background-color: #eee;
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

const isInRange = (range, lineNo) => range && (lineNo >= range[0] && lineNo <= range[1])

export default ({startedAt, filepath, source, selectedLine, lineRange, onClickLine}) =>
  <div>
    <p className="has-text-grey-light is-size-7">
      {truncLeft(filepath)}
    </p>
    <pre className="TestSourceView-content has-text-grey-light has-background-white is-size-7">
    {
      source.map((l, i) =>
        <TestSourceLine
          key={i}
          startedAt={startedAt}
          selected={selectedLine === i + 1}
          isInRange={isInRange(lineRange, i)}
          lineNo={i + 1}
          line={l}
          onClick={(e) => onClickLine && onClickLine(e)}
        />
      )
    }
    </pre>
    <style jsx>{`
    .TestSourceView-content {
      overflow-x: hidden;
      padding: 0;
    }
    `}</style>
  </div>
