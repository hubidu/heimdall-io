import moment from 'moment'
import Link from 'next/link'

import TestTags from './test-tags'

import trunc from '../services/utils/trunc'
import round from '../services/utils/round'
import linkToReportDetails from '../services/utils/link-to-report-details'

const hasData = title => title && title.indexOf('|') > -1
const extractTitle = title => title && (title.indexOf('|') >= 0 ? title.split('|')[0] : title)
const extractTitleData = title => title.indexOf('|') >= 0 ? title.split('|')[1] : undefined
const formatPrefix = str => str && str.replace(/--/gi, '/')

export default ({ownerkey, project, hashcategory, report, isListView = true}) =>
  <div className="TestTitle">
    <div className="TestTitle-prefix has-text-grey is-size-7">
      { !isListView && report.Environment &&
        <small className="TestTitle-environment is-size-7 has-text-info">
          {report.Environment}
        </small>
      }
      {formatPrefix(report.Prefix)}

      {
        isListView === false &&
          <span className="TestTitle-time is-pulled-right">
            <span>at</span>&nbsp;<strong>{moment(report.StartedAt).format('ddd, H:mm')}</strong>
            &nbsp;&middot;&nbsp;
            <span>in</span>&nbsp;<strong>{round(report.Duration)} s</strong>
            &nbsp;&middot;&nbsp;
            {
              report.User &&
              <span>
                <span>run by</span>&nbsp;<strong>{report.User.Email}</strong>
              </span>
            }
          </span>
      }
    </div>

    <div className={`TestTitle-title ${isListView ? '' : 'is-size-6'}`}>
    {
      isListView ?
        <Link href={linkToReportDetails(ownerkey, project, undefined, hashcategory)}>
          <a>
            <b className="has-text-dark">{extractTitle(report.Title)}</b>
          </a>
        </Link>
        :
        <strong>{extractTitle(report.Title)}</strong>
    }
    </div>
    {
      hasData(report.Title) &&
      <div className="is-size-7 has-text-primary is-hidden-mobile">
        {trunc(extractTitleData(report.Title), 120)}
      </div>
    }
    <TestTags tags={report.Tags} />

    <style jsx>{`
    .TestTitle {
    }
    .TestTitle-environment {
      margin: 2px;
      padding: 1px;
      border: 1px solid #209cee;
      border-radius: 3px;
    }
    .TestTitle-title {
      font-size: .85rem;
    }
    `}</style>
  </div>
