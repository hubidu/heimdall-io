import Highlight from 'react-highlight'

/**
 * <div><div>App.render</div>
<div style="font-size: 0.9em; margin-bottom: 0.9em;">
    <a tabindex="0" style="text-decoration: none; color: rgb(135, 142, 145); cursor: pointer;">C:/Users/stefan.huber/projects/react-starter/src/App.jsx:24</a>
</div>
<span>
    <a style="cursor: pointer;">
        <pre style="display: block; padding: 0.5em; margin-top: 0.5em; margin-bottom: 0.5em; overflow-x: auto; white-space: pre-wrap; border-radius: 0.25rem; background-color: rgba(206, 17, 38, 0.05);"><code style="font-family: Consolas, Menlo, monospace;">
            <span data-ansi-line="true"><span></span><span> </span><span style="color: #333333;"> 21 | </span><span></span></span><br>
            <span data-ansi-line="true"><span> </span><span style="color: #333333;"> 22 | </span><span>    </span><span style="color: #881280;">&lt;</span><span></span><span style="color: #881280;">Welcome</span><span> </span><span style="color: #881280;">/</span><span></span><span style="color: #881280;">&gt;</span><span></span></span><br>
            <span data-ansi-line="true"><span> </span><span style="color: #333333;"> 23 | </span><span></span></span><br>
            <span data-ansi-line="true" style="background-color: rgb(252, 207, 207);"><span></span><span style="color: #881280;"></span><span style="color: #881280;">&gt;</span><span style="color: #881280;"></span><span></span><span style="color: #333333;"> 24 | </span><span>    </span><span style="color: #881280;">&lt;</span><span></span><span style="color: #881280;">PeopleInSpace</span><span> people</span><span style="color: #881280;">=</span><span>{</span><span style="color: #c80000;">this</span><span></span><span style="color: #881280;">.</span><span>state</span><span style="color: #881280;">.</span><span>people} </span><span style="color: #881280;">/</span><span></span><span style="color: #881280;">&gt;</span><span></span></span><br>
            <span data-ansi-line="true"><span> </span><span style="color: #333333;"> 25 | </span><span></span></span><br>
            <span data-ansi-line="true"><span> </span><span style="color: #333333;"> 26 | </span><span>  </span><span style="color: #881280;">&lt;</span><span></span><span style="color: #881280;">/</span><span></span><span style="color: #881280;">div</span><span></span><span style="color: #881280;">&gt;</span><span></span></span><br><span data-ansi-line="true"><span> </span><span style="color: #333333;"> 27 | </span><span>)</span><span style="color: #881280;">;</span><span></span><span></span></span></code></pre></a><button style="margin-bottom: 1.5em; color: rgb(135, 142, 145); cursor: pointer; border: none; display: block; width: 100%; text-align: left; background: rgb(255, 255, 255); font-family: Consolas, Menlo, monospace; font-size: 1em; padding: 0px; line-height: 1.5;">View compiled</button>
    </span></div>
 */

const truncLeft = (str, max = 80) => {
  if (str.length <= max) return str
  return '...' + str.slice(str.length - max)
}

const sourceCode = (code, location) => code
    .map(entry => {
        return entry.Line === location.Line ?
            entry.Line + ' ==>' + entry.Value
            : entry.Line + '    ' + entry.Value
    }).join('\n')

export default ({ code, location }) =>
    <div className="SourceCodeSnippet">
        <p>
            {truncLeft(location.File)}
        </p>
        <Highlight className="javascript">
            {sourceCode(code, location)}
        </Highlight>
        <style jsx>{`
        .SourceCodeSnippet {
        }
        .SourceCodeSnippet > pre {
          padding: 0 !important;
        }
        `}</style>
    </div>
