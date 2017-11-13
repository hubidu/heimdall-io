import styled from 'styled-components'

import ScreenshotThumbnail from './ScreenshotThumbnail'
import SourceCodeSnippet from './SourceCodeSnippet'

const Container = styled.div`
    display: flex;
    & > div {
        flex:  1;
        max-width: 33%;

        .hljs {
            overflow: hidden;
        }

    }
`

export default ({run}) => 
    <div>
        {
            run.screenshots.map((s, i) =>
                <div key={i} className="bb b--black-10">
                    <div className="flex">
                        <div className="flex-auto w-33 mw6">
                            <ScreenshotThumbnail success={s.success} title={s.page.title} url={s.page.url} path={run.path} screenshot={s.screenshot} />
                        </div>
                        <div className="flex-auto w-67">
                        {
                            s.codeStack.map((cs, i) => <SourceCodeSnippet key={i} code={cs.source} location={cs.location} />)
                        }
                        </div>
                    </div>
                </div>
            )
        }

    </div>