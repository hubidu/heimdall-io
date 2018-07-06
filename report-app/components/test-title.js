import Link from 'next/link'

const trunc = (msg, MaxLen = 80) => {
  if (!msg) return msg
  let res = msg
  if (msg.length > MaxLen) {
    res = msg.substring(0, MaxLen) + '...'
  }
  return res
}
const linkToReportDetails = (ownerkey, project, id, hashcategory) => {
  return {
    pathname: '/details',
    query: { ownerkey, project, id, hashcategory }
  }
}
const hasData = title => title.indexOf('|') > -1
const extractTitle = title => title.indexOf('|') >= 0 ? title.split('|')[0] : title
const extractTitleData = title => title.indexOf('|') >= 0 ? title.split('|')[1] : undefined

export default ({ownerkey, project, hashcategory, report}) =>
  <div className="TestTitle">
    <div className="has-text-grey is-size-7">
      {report.Prefix.replace(/--/gi, '/')}
    </div>

    <div>
      <Link href={linkToReportDetails(ownerkey, project, report._id, hashcategory)}>
        <a>
          <b className="hast-text-dark">{extractTitle(report.Title)}</b>
        </a>
      </Link>
    </div>

    { report.Tags && report.Tags.length > 0 &&
      <div>
      {
        report.Tags.map((tag, i) =>
          <small key={i} className="tag is-light has-text-link">
            {tag}
          </small>
        )
      }
     </div>
    }

    {
      hasData(report.Title) &&
      <div className="is-size-7 has-text-primary is-hidden-mobile">
        {trunc(extractTitleData(report.Title), 120)}
      </div>
    }
    <style jsx>{`
    .TestTitle {
    }
    `}</style>
  </div>
