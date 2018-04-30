import React from 'react'
import Link from 'next/link'

import Layout from '../components/layout'
import TestReportList from '../components/test-report-list'

import getProjects from '../services/get-projects'

export default class IndexPage extends React.Component {
  static async getInitialProps ({ query }) {
    const ownerkey = query.ownerkey
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const projects = await getProjects(query.ownerkey)
    return { projects, ownerkey }
  }

  linkToProject(ownerkey, project) {
    return {
      pathname: '/tests',
      query: { ownerkey, project}
    }
  }

  render () {
    return (
      <Layout title="List of projects">
        <h2>Projects for Owner Key {this.props.ownerkey}</h2>
        <ul>
          <li>
            <Link href={this.linkToProject(this.props.ownerkey, undefined)}>
              All projects
            </Link>
          </li>
          {
            this.props.projects.map((project, i) =>
              <li key={i}>
                <Link href={this.linkToProject(this.props.ownerkey, project)}>
                {project}
                </Link>
              </li>
            )
          }
        </ul>
      </Layout>
    )
  }
}
