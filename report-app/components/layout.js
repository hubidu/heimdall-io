import Link from 'next/link'
import Head from 'next/head'

export default ({ children, title = 'This is the default title' }) => (
  <div style={{'fontFamily': 'roboto, noto'}} >
    <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />

        <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/monokai-sublime.css" />
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.7.0/css/tachyons.min.css"/>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
        <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
    </Head>
    <nav className="pa3 shadow-1">
      <div className="nowrap overflow-x-auto">
        <a className="link dim blue f6 f6-ns dib mr3" href="/tree" title="Status Overview">
          Overview
        </a>
        <a className="link dim blue f6 f6-ns dib mr3" href="/" title="Detailed Report Status">
          Details
        </a>
      </div>
    </nav>
    <div className="mh5">
      { children }
    </div>

  </div>
)
