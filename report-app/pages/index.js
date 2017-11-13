import React from 'react'

import Layout from '../components/layout'
import Test from '../components/Test'

import getTestRuns from '../services/get-test-runs'

const twoDecimals = num => parseFloat(Math.round(num * 100) / 100).toFixed(2)
const sumDuration = tests => tests.reduce((sum, t) => sum + t.runs[0].duration, 0)

export default class IndexPage extends React.Component {
  static async getInitialProps () {
    return { tests: await getTestRuns() }
  }

  render () {
    return (
      <Layout title="Detailed Test Report">
          <h3>Details</h3>

          <div className="black-70 mb3">
            <strong>{this.props.tests.length}</strong> tests
            |
            &nbsp;
            <strong>{twoDecimals(sumDuration(this.props.tests))}s</strong> overall duration
          </div>

          {
              this.props.tests.map(test =>
                <Test key={test.title} test={test}/>
              )
          }
          <br/>
          <br/>
          <br/>
          <br/>
      </Layout>
    )
  }
}
