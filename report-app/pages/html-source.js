import React from 'react'
import Layout from '../components/layout'

import getReportById from '../services/get-report-by-id'
import getHtmlSource from '../services/get-html-source'

export default class HtmlSourcePage extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)
    const source = await getHtmlSource(report.ReportDir)

    return {
      report,
      source
    }
  }

  render () {
    const attrs = {title: `Html Source View`}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid" dangerouslySetInnerHTML={{__html: this.props.source}}>
        </div>
      </Layout>
    )
  }
}
