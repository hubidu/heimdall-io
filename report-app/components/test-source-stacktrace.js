import SourceCodeSnippet from '../components/SourceCodeSnippet'

export default ({stack}) =>
  <div className="TestSourceStacktrace box">
    <SourceCodeSnippet location={stack[0].Location} code={stack[0].Source} />

    <style jsx>{`
    .TestSourceStacktrace {
      background-color: #fff;
      margin: 0;
      margin 5px;
      padding: 1em 5px;
    }
    `}</style>
  </div>
