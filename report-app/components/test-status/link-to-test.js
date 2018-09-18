import Link from 'next/link'

import linkToReportDetails from '../../services/utils/link-to-report-details'

export default ({ownerkey, project, reportId, hashcategory, children}) =>
  <Link href={linkToReportDetails(ownerkey, project, reportId, hashcategory)}>
    <a>
      <b className="has-text-dark is-size-6">
        {children}
      </b>
    </a>
  </Link>
