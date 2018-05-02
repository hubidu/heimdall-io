import moment from 'moment'
import React from 'react'
import Link from 'next/link'
import { List, Header, Icon } from 'semantic-ui-react'

import ProjectIcon from 'react-icons/lib/fa/archive'
import KeyIcon from 'react-icons/lib/fa/key'

import Layout from '../components/layout'
import TestResultIcon from '../components/test-result-icon'

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
        <Header as='h2'>
          <KeyIcon/>
          Your Test Projects
          <Header.Subheader>
            Listing all Projects for Owner Key {this.props.ownerkey}
          </Header.Subheader>
        </Header>

        <List divided relaxed>
          {
            this.props.projects.map((project, i) =>
              <List.Item key={i}>
                <List.Icon size="large">
                  <ProjectIcon/>
                </List.Icon>
                <List.Content>
                  <List.Header>
                    <Link href={this.linkToProject(this.props.ownerkey, project.Name)}>
                      <a>
                        {project.Name}
                      </a>
                    </Link>
                  </List.Header>
                  <List.Description>
                    {moment(project.Report.StartedAt).fromNow()}
                    &nbsp;
                    [{project.Report.Duration} s]
                    &nbsp;
                    <TestResultIcon result={project.Report.Result} />
                    {project.Report.Title}
                  </List.Description>
                </List.Content>
                </List.Item>
              )
          }
        </List>
      </Layout>
    )
  }
}
