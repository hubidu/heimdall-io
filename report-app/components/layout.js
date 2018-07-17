import Link from 'next/link'
import Head from 'next/head'

import NProgress from 'nprogress'
import Router from 'next/router'

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const linkToProjects = ownerkey => {
  return {
    pathname: '/projects',
    query: { ownerkey }
  }
}

export default ({ children, title = '', ownerkey, showNav = true }) => (
  <div style={{'fontFamily': 'roboto, noto'}} >
    <Head>
        {<title>{ title }</title>}
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />

        {/* Import CSS for nprogress */}
        <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />

        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
        <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css" />
    </Head>
    {
      showNav &&
      <nav className="navbar is-transparent">
      <div className="navbar-brand">
        <img src="data:image/png;base64,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" />
        <strong className="navbar-item has-text-black is-size-5" href="https://bulma.io">
          heimdal.io
        </strong>
        <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" className="navbar-menu">
        <div className="navbar-start">
          <span  className="navbar-item">
            <Link href={linkToProjects(ownerkey)}>
            <a>
              Projects
            </a>
            </Link>
          </span>
       </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    }
    <div className="mh5">
      { children }
    </div>

  </div>
)
