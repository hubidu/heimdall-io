import React from 'react'
import Layout from '../components/layout'

import TestStati from '../components/test-status/test-stati'
import TestStatiToc from '../components/test-status/test-stati-toc'

import getTestStatus from '../services/get-test-status'

const groupByPrefix = testStatus => {
  return testStatus.reduce((agg, ts) => {
    if (agg[ts.prefix] === undefined) {
      agg[ts.prefix] = []
    }
    agg[ts.prefix].push(ts)
    return agg
  }, {})
}

const createNode = pathItem => ({
  name: pathItem,
  count: 0,
  children: []
})
const getChildNode = (node, name) => node.children.find(n => n.name === name)
const sortByName = (a, b) => {
  const n1 = a.name
  const n2 = b.name
  return n1.localeCompare(n2)
}
const buildTOC = paths => paths.reduce((rootNode, p) => {
  const pathItems = p.split('--').map(part => part.trim())

  let currentNode = rootNode
  pathItems.forEach(pathItem => {
    let node = getChildNode(currentNode, pathItem)
    if (!node) {
      currentNode.children.push(createNode(pathItem))
      currentNode.children.sort(sortByName)
      currentNode.count++
    }

    currentNode = getChildNode(currentNode, pathItem)
  })

  return rootNode
}, createNode('root'))

export default class TestStatusPage extends React.Component {
  static async getInitialProps ({ query: { ownerkey } }) {
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    const testStatus = await getTestStatus(ownerkey)
    const groupedByPrefix = groupByPrefix(testStatus)
    const toc = buildTOC(Object.keys(groupedByPrefix))

    return { ownerkey, testStatus, groupedByPrefix, toc }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    const attrs = {title: `Test Status of ${this.props.ownerkey}`, ownerkey: this.props.ownerkey}

    return (
      <Layout {...attrs}>
        <div className="container is-fluid">
          <h1 className="title">
            Test Status
          </h1>
          <h2 className="subtitle">
            Owner: {this.props.ownerkey}.
          </h2>

          <div className="columns">
            <div className="column is-3">
              <TestStatiToc toc={this.props.toc} />
            </div>
            <div className="column is-9">
              <TestStati ownerkey={this.props.ownerkey} status={this.props.groupedByPrefix} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
