import React from 'react'
const base64 = require('base-64')

import Layout from '../components/layout'

import config from '../services/config'
import getReportById from '../services/get-report-by-id'

export default class HtmlSourcePage extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    const report = await getReportById(id)

    const filename = 'error-page.html'
    const path = report.ReportDir
    const docUrl = `http://${config.ReportServiceHost}/attachments/${base64.encode(encodeURIComponent(path))}/${base64.encode(encodeURIComponent(filename))}`.toString()
    return {
      docUrl,
    }
  }

  render () {
    const attrs = {title: `Html Source View`}
    console.log(typeof this.props.docUrl)
    return (
      <Layout {...attrs}>
        <iframe sandbox src={this.props.docUrl} style={{position: 'absolute', height: '100%', width: '100%', border: 'none'}}>
          {this.props.docUrl}
        </iframe>
      </Layout>
    )
  }
}
