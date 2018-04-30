import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ query, res }) {
    const { ownerkey } = query
    if (!ownerkey) throw new Error('Please provide your owner key in the query parameters')

    if (res) {
      res.writeHead(302, {
        Location: `/projects?ownerkey=${ownerkey}`
      })
      res.end()
      res.finished = true
    } else {
      Router.push(`/projects?ownerkey=${ownerkey}`)
    }
    return {}
  }
}
