import moment from 'moment'
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

export default ({ownerkey, project, hashcategory, report, isListView = true}) =>
  <div className="TestTitle">
    <div className="TestTitle-prefix has-text-grey is-size-7">
      {report.Prefix.replace(/--/gi, '/')}

      {
        isListView === false &&
          <span className="is-pulled-right">
            <span>at</span>&nbsp;<strong>{moment(report.StartedAt).format('ddd, h:m')}</strong>
            &nbsp;&middot;&nbsp;
            <span>in</span>&nbsp;<strong>{report.Duration}s</strong>
            &nbsp;&middot;&nbsp;
            <span>run by</span>&nbsp;<strong>{report.User.Email}</strong>
          </span>
      }
    </div>

    <div className="TestTitle-title">
    {
      isListView ?
        <Link href={linkToReportDetails(ownerkey, project, report._id, hashcategory)}>
          <a>
            <b className="hast-text-dark">{extractTitle(report.Title)}</b>
          </a>
        </Link>
        :
        <strong>{extractTitle(report.Title)}</strong>
    }
    </div>

    <div className="TestTitle-tags">
      { report.Environment &&
        <small className="tag is-info">
          {report.Environment}
        </small>
      }
      {
          report.Tags && report.Tags.length > 0 && report.Tags.map((tag, i) =>
          <small key={i} className="tag is-light has-text-link">
            {tag}
          </small>
        )
      }
    </div>

    {
      hasData(report.Title) &&
      <div className="is-size-7 has-text-primary is-hidden-mobile">
        {trunc(extractTitleData(report.Title), 120)}
      </div>
    }
    <style jsx>{`
    .TestTitle {
    }

    .TestTitle-title {
      font-size: 0.9rem;
    }
    `}</style>
  </div>
