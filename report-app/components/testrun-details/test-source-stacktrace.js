import SourceCodeSnippet from './source-code-snippet'

export default ({stack, cmd}) =>
  <div className="TestSourceStacktrace box">
    <SourceCodeSnippet
      location={stack[0].Location}
      code={stack[0].Source}
      actual={`  ==> I.${cmd.Name} (${cmd.Args.map(arg => `'${arg}'`).join(',')})`}
    />

    <style jsx>{`
    .TestSourceStacktrace {
      background-color: #fff;
      margin: 0;
      margin 5px;
      padding: 1em 5px;
    }
    `}</style>
  </div>
