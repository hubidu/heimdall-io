import styled from 'styled-components'

// const Screenshot = styled.div`
//   width: 30%;
//   text-align: center;
//   text-indent: 0;
//   border: thin silver solid;
//   margin: 0.5em;
//   border-color: ${props => props.success === true ? 'MediumSpringGreen' : 'OrangeRed'}
// `

const screenshotUrl = (path, filename) => `/api/screenshots/${encodeURIComponent(path)}/${encodeURIComponent(filename)}`
// const assetUrl = (path, filename) => `/api/assets/${encodeURIComponent(path)}/${encodeURIComponent(filename)}`

const sourceFileFrom = screenshot => screenshot && screenshot.replace('.png', '.html')
const browserLogFileFrom = screenshot => screenshot && screenshot.replace('.png', '.logs')

export default ({ success, title, url, path, screenshot }) =>
    <div>
        <figure className={success ? `br2 ba bw2 b--light-green pa3` : `br2 ba bw2 b--light-red pa3`}>
            <h6 className="mt1 mb1 lh-copy">
                <a href={url}>{url}</a>
            </h6>
            <h6 className="mt1 mb1 lh-copy">{title}</h6>

            <img className="" width={320} src={screenshotUrl(path, screenshot)} alt="Screenshot" />
            <figcaption className="f6 mt1 mb1 lh-copy">
                {screenshot}
            </figcaption>
        </figure>
    </div>
