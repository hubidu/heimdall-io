import moment from 'moment'
import React from 'react'
import Link from 'next/link'

import Layout from '../components/layout'
import TestResultDeviceIcon from '../components/test-result-device-icon'

import getProjects from '../services/get-projects'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query }) {
    const ownerkey = query.ownerkey
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const projects = await getProjects(query.ownerkey)
    return { projects, numberOfProjects: projects.length - 1,  ownerkey }
  }

  linkToProject(ownerkey, project) {
    return {
      pathname: '/tests',
      query: { ownerkey, project}
    }
  }

  render () {
    const attrs = {title: `Test Projects (${this.props.numberOfProjects})`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <h1 className="title">
            You Projects
          </h1>
          <h2 className="subtitle">
            Owner: {this.props.ownerkey}
          </h2>

          <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Project</th>
              <th></th>
              <th>Last Executed Test</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.projects.map((project, i) =>
              <tr>
                <td>
                  <Link href={this.linkToProject(this.props.ownerkey, project.Name)}>
                    <a>
                      {project.Name}
                    </a>
                  </Link>
                </td>
                <td>
                  <TestResultDeviceIcon result={project.Report.Result} deviceSettings={project.Report.DeviceSettings} />
                </td>
                <td>
                  {project.Report.Title}
                </td>
                <td>
                  <strong>{moment(project.Report.Started).fromNow()}</strong>
                  <br/>
                  in {~~project.Report.Duration}s

                </td>
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
