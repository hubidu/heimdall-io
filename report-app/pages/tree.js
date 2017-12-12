/**
 * OBSOLETE
 */

import React from 'react'

import Layout from '../components/layout'

import DesktopIcon from 'react-icons/lib/fa/desktop'
import MobileIcon from 'react-icons/lib/fa/mobile'

import Tree from '../components/tree'

import getTestRuns from '../services/get-test-runs'
import makeTree from '../services/make-tree'


export default class TreePage extends React.Component {
  static async getInitialProps () {
    const testRuns = await getTestRuns()

    return { testRuns }
  }

  constructor(props) {
    super(props);
    this.state = { tree: makeTree(props.testRuns) };

    this.handleFilterTestsByDevice = this.handleFilterTestsByDevice.bind(this);
  }

  handleFilterTestsByDevice(e, deviceType) {
    e.preventDefault()

    const tree = makeTree(this.props.testRuns, deviceType)
    this.setState({ tree })
  }

  render () {
    return (
      <Layout title="Status Overview">
        <h3>
          Status Overview

          <span className="fr">
            <button className="f6 link dim ba ph3 pv2 mb2 dib bg-white black" onClick={e => this.handleFilterTestsByDevice(e, 'desktop')}>
              <DesktopIcon />
            </button>
            <button className="f6 link dim ba ph3 pv2 mb2 dib bg-white black" onClick={e => this.handleFilterTestsByDevice(e, 'mobile')}>
             <MobileIcon />
            </button>
          </span>
        </h3>

        <div>
          { this.state && this.state.tree &&
            <Tree node={this.state.tree} />
          }
        </div>
      </Layout>
    )
  }
}
