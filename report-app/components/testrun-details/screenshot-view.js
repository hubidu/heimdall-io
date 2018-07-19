import ImageIcon from 'react-icons/lib/fa/image'
import Magnifier from 'react-magnifier';

import getScreenshotUrl from '../../services/get-screenshot-url'

const handleImageClick = (reportDir, imageFile) => {
  window.location = getScreenshotUrl(reportDir, imageFile)
}

const Screenshot = ({title, pageTitle, pageUrl, reportDir, imageFile}) =>
  <div className="Screenshot">
    {
      title &&
      <h6 className="has-text-centered has-text-grey-light">
        {title}
      </h6>
    }
    <h6 className="Screenshot-title title is-4">
      <a className="Screenshot-openInTab has-text-grey-light" href={getScreenshotUrl(reportDir, imageFile)} target="_blank">
        <ImageIcon />
      </a>
      &nbsp;
      {pageTitle}
    </h6>

    <h6 className="Screenshot-url has-text-link is-size-7">
      <a href={pageUrl} target="_blank">{pageUrl}</a>
    </h6>

    <Magnifier
      onClick={() => handleImageClick(reportDir, imageFile)}
      zoomFactor={2}
      mgWidth={300}
      mgHeight={200}
      mgShape='square'
      src={getScreenshotUrl(reportDir, imageFile)}
      width='100%' />

    <style jsx>{`
    .Screenshot-title {
      margin: 0;
    }
    .Screenshot-url {
      margin-bottom: 1em;
    }
    `}</style>
  </div>


export default ({ reportDir, selectedScreenshot, reportDirDiff, selectedScreenshotDiff }) =>
  <div className="ScreenshotContainer">
    {
      selectedScreenshot &&
      <Screenshot
        title={selectedScreenshotDiff && 'This test run'}
        pageTitle={selectedScreenshot.Page.Title}
        pageUrl={selectedScreenshot.Page.Url}
        reportDir={reportDir}
        imageFile={selectedScreenshot.Screenshot}
      />
    }
    {
      selectedScreenshotDiff &&
        <hr />
    }
    {
      selectedScreenshotDiff &&
      <Screenshot
       title={'Other test run'}
        pageTitle={selectedScreenshotDiff.Page.Title}
        pageUrl={selectedScreenshotDiff.Page.Url}
        reportDir={reportDirDiff}
        imageFile={selectedScreenshotDiff.Screenshot}
      />
    }
  </div>
