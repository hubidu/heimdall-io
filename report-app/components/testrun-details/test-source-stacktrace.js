import SourceCodeSnippet from './source-code-snippet'

export default ({ selected = false, stack, cmd, onClick }) => {
  return (<div
    className={`TestSourceStacktrace ${selected === true ? 'TestSourceStacktrace-selected' : ''}`}
    onClick={e => onClick && onClick(e)}
  >
    {
      (stack && stack.length > 0) ?
        <SourceCodeSnippet
          location={stack[0].Location}
          code={stack[0].Source}
          actual={`  ==> I.${cmd.Name} (${cmd.Args.map(arg => `'${arg}'`).join(',')})`}
        />
        :
        <span>No stacktrace found</span>
    }

    <style jsx>{`
    .TestSourceStacktrace {
      background-color: #fff;
      margin: 0;
      margin 5px;
      padding: 1em 5px;
    }
    .TestSourceStacktrace-selected {
      border-left: 2px solid #3273dc;
    }

    `}</style>
  </div>)

}
