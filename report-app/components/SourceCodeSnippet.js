import Highlight from 'react-highlight'
import styled from 'styled-components'

const SourceCodeSnippet = styled.div`
  margin: 0.5em;
`

const sourceCode = (code, location) => code
    .map(entry => {
        return entry.Line === location.Line ?
            entry.Line + ' ==>' + entry.Value
            : entry.Line + '    ' + entry.Value
    }).join('\n')

export default ({ code, location }) =>
    <SourceCodeSnippet>
        <div className={'black-50'}>
            {location.File}
        </div>
        <Highlight className="javascript">
            {sourceCode(code, location)}
        </Highlight>
    </SourceCodeSnippet>
