import moment from 'moment'
import React from 'react'
import Link from 'next/link'

import Layout from '../components/layout'
import TestResultDeviceIcon from '../components/test-result-device-icon'

import getProjects from '../services/get-projects'
import deleteProject from '../services/delete-project'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query }) {
    const ownerkey = query.ownerkey
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const projects = await getProjects(query.ownerkey)
    return { projects, numberOfProjects: projects.length - 1,  ownerkey }
  }

  constructor(props) {
    super(props)

    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  async handleDeleteClick(ownerkey, projectName) {
    await deleteProject(ownerkey, projectName)

    window.location.href = `/projects?ownerkey=${this.props.ownerkey}`
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.projects.map((project, i) =>
                <tr key={i}>
                  <td>
                    <Link href={this.linkToProject(this.props.ownerkey, project.Name)}>
                      <a>
                        <strong>{project.Name}</strong>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <TestResultDeviceIcon result={project.Report.Result} deviceSettings={project.Report.DeviceSettings} />
                  </td>
                  <td>
                    <span className="has-text-grey">{project.Report.Title}</span>
                  </td>
                  <td>
                    <strong>{moment(project.Report.Started).fromNow()}</strong>
                    <br/>
                    in {~~project.Report.Duration}s

                  </td>
                  <td>
                    <a className="button is-danger is-small"
                      onClick={e => this.handleDeleteClick(this.props.ownerkey, project.Name)}>
                      Delete
                    </a>
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
