import Magnifier from 'react-magnifier';
import getScreenshotUrl from '../services/get-screenshot-url'

export default ({ reportDir, selectedScreenshot, selectedScreenshotDiff }) =>
  selectedScreenshot ?
  <div className="ScreenshotView">
    <h6 className="ScreenshotView-title title is-4">{selectedScreenshot.Page.Title}</h6>

    <h6 className="ScreenshotView-url has-text-link is-size-7">
      <a href={selectedScreenshot.Page.Url} target="_blank">{selectedScreenshot.Page.Url}</a>
    </h6>
    <Magnifier
      zoomFactor={2}
      mgWidth={300}
      mgHeight={200}
      mgShape='square'
      src={getScreenshotUrl(reportDir, selectedScreenshot.Screenshot)}
      width='100%' />

      { selectedScreenshotDiff &&
        <Magnifier
        zoomFactor={2}
        mgWidth={300}
        mgHeight={200}
        mgShape='square'
        src={getScreenshotUrl(reportDir, selectedScreenshotDiff.Screenshot)}
        width='100%' />
      }
    <style jsx>{`
    // .ScreenshotView {
    //   position: fixed;
    //   top: 100px;
    //   left: 50%;
    // }
    .ScreenshotView-title {
      margin: 0;
    }
    .ScreenshotView-url {
      margin-bottom: 1em;
    }
    `}</style>
  </div>
  : null
