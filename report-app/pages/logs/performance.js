import React from 'react'
import moment from 'moment'
import Layout from '../../components/layout'

import getReportById from '../../services/get-report-by-id'
import getPerformanceLogs from '../../services/get-performance-logs'

import round from '../../services/utils/round'

const mapLogData = logs => logs.map(l => ({
  startTime: round(l.startTime, 2),
  duration: round(l.duration),
  size: l.encodedBodySize,
  entryType: l.entryType,
  name: l.name,
}))

const tagColor = t => {
  switch (t) {
    case 'paint': return 'is-primary';
    case 'navigation': return 'is-success';
    case 'resource': return 'is-lighter';
    default: return 'is-light';
  }
}

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    // TODO
    const report = await getReportById(id)
    const [logs] = await Promise.all([
      await getPerformanceLogs(report.ReportDir),
    ])

    return {
      report,
      logs: mapLogData(logs),
    }

  }

  render () {
    const attrs = {title: `Performance Logs`}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <table className="table">
            <thead>
              <tr>
                <th>Start</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Size</th>
                <th>Name</th>
              </tr>

            </thead>
            <tbody>
            {
              this.props.logs.map((l, i) =>
                <tr key={i}>
                  <td>{l.startTime}</td>
                  <td className={`${tagColor(l.entryType)}`}>
                    {l.entryType}
                  </td>
                  <td>{l.duration}</td>
                  <td>{l.size}</td>
                  <td>{l.name}</td>
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
