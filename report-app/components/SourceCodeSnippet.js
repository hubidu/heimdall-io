import Highlight from 'react-highlight'
import styled from 'styled-components'

const SourceCodeSnippet = styled.div`
  margin: 0.5em;
`

const sourceCode = (code, location) => code
    .map(entry => {
        return entry.line === location.line ?
            entry.line + ' ==>' + entry.value
            : entry.line + '    ' + entry.value
    }).join('\n')

export default ({ code, location }) =>
    <SourceCodeSnippet>
        <div className={'black-50'}>
            {location.file}
        </div>
        <Highlight className="javascript">
            {sourceCode(code, location)}
        </Highlight>
    </SourceCodeSnippet>