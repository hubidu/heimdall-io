import React from 'react'
import moment from 'moment'
import Layout from '../components/layout'

import getReportById from '../services/get-report-by-id'
import getBrowserlogs from '../services/get-browserlogs'

const tagColor = l => {
  switch (l.level) {
    case 'SEVERE': return 'is-danger';
    case 'INFO': return 'is-info';
    case 'WARNING': return 'is-warning';
    default: return 'is-light';
  }
}

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)
    const [browserlogs] = await Promise.all([
      await getBrowserlogs(report.ReportDir),
    ])

    return {
      report,
      browserlogs
    }

  }

  render () {
    const attrs = {title: `Browserlogs`}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Message</th>
              </tr>

            </thead>
            <tbody>
            {
              this.props.browserlogs.map((l, i) =>
                <tr key={i}>
                  <td>{moment(l.timestamp).format('ddd, H:mm')}</td>
                  <td>
                    <span className={`tag ${tagColor(l)}`}>
                    {l.level}
                    </span>
                  </td>
                  <td>{l.message}</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </Layout>
    )
  }
}
