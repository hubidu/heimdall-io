import Highlight from 'react-highlight'

const sourceCode = (code, location) => code
    .map(entry => {
        return entry.Line === location.Line ?
            entry.Line + ' ==>' + entry.Value
            : entry.Line + '    ' + entry.Value
    }).join('\n')

export default ({ code, location }) =>
    <div className="ma1">
        <div className={'black-50'}>
            {location.File}
        </div>
        <Highlight className="javascript">
            {sourceCode(code, location)}
        </Highlight>
    </div>
