
import ScreenshotThumbnail from './ScreenshotThumbnail'
import SourceCodeSnippet from './SourceCodeSnippet'

export default ({run}) =>
    <div>
        {
            run.screenshots.map((s, i) =>
                <div key={i} className="bb b--black-10">
                    <div className="flex">
                        <div className="flex-auto w-33 mw6">
                            <ScreenshotThumbnail success={s.Success} title={s.Page.Title} url={s.Page.Url} path={run.ReportDir} screenshot={s.Screenshot} />
                        </div>
                        <div className="flex-auto w-67">
                        {
                            s.CodeStack.map((cs, i) => <SourceCodeSnippet key={i} code={cs.Source} location={cs.Location} />)
                        }
                        </div>
                    </div>
                </div>
            )
        }

    </div>
