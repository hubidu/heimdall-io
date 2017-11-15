import styled from 'styled-components'

import getScreenshotUrl from '../services/get-sceenshot-url'

export default ({ success, title, url, path, screenshot }) =>
    <div>
        <figure className={success ? `br2 ba bw2 b--light-green pa3` : `br2 ba bw2 b--light-red pa3`}>
            <h6 className="mt1 mb1 lh-copy">
                <a href={url}>{url}</a>
            </h6>
            <h6 className="mt1 mb1 lh-copy">{title}</h6>

            <img className="" width={320} src={getScreenshotUrl(path, screenshot)} alt="Screenshot" />
            <figcaption className="f6 mt1 mb1 lh-copy">
                {screenshot}
            </figcaption>
        </figure>
    </div>
