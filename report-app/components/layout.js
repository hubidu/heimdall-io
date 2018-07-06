import Link from 'next/link'
import Head from 'next/head'

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

        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
        <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css" />
    </Head>
    {
      showNav &&
      <nav className="navbar is-transparent">
      <div className="navbar-brand">
        <strong className="navbar-item has-text-black is-size-5" href="https://bulma.io">
          heimdall.io
        </strong>
        <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
              <Link href={linkToProjects(ownerkey)}>
                <a className="navbar-link">
                  Projects
                </a>
              </Link>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="button is-primary" href="https://github.com/jgthms/bulma/releases/download/0.7.1/bulma-0.7.1.zip">
                  <span className="icon">
                    <i className="fas fa-download"></i>
                  </span>
                  <span>Download</span>
                </a>
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
