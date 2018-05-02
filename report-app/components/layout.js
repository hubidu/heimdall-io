import Link from 'next/link'
import Head from 'next/head'

const linkToProjects = ownerkey => {
  return {
    pathname: '/projects',
    query: { ownerkey }
  }
}

export default ({ children, title = 'This is the default title', ownerkey, showNav = true }) => (
  <div style={{'fontFamily': 'roboto, noto'}} >
    <Head>
        <title>{ title }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />

        <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css" />
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.7.0/css/tachyons.min.css"/>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
        <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
    </Head>
    {
      showNav &&
      <nav className="mb2 pa3 shadow-1">
        <div className="nowrap overflow-x-auto">
          <Link href={linkToProjects(ownerkey)}>
            <a>
            Projects
            </a>
          </Link>
        </div>
      </nav>
    }
    <div className="mh5">
      { children }
    </div>

  </div>
)
