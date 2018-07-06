import getScreenshotUrl from '../services/get-screenshot-url'

export default ({reportDir, selectedScreenshot}) =>
  selectedScreenshot ?
  <div>
    <h6>{selectedScreenshot.Page.Title}</h6>
    <h6 className="has-text-link is-size-7">{selectedScreenshot.Page.Url}</h6>
    <img src={getScreenshotUrl(reportDir, selectedScreenshot.Screenshot)} />
  </div>
  : null
