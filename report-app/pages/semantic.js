import Layout from '../components/layout'

import Head from 'next/head'
import { Container, Modal, Header, Button, List } from 'semantic-ui-react'

import SuccessesAndFailuresBars from '../components/SuccessesAndFailuresBars'

const data = [
  { t: 1510923810946, value: 20, success: true},
  { t: 1510923810846, value: 20, success: false},
  { t: 1520923810946, value: 40, success: false},
  { t: 1530923810946, value: 50, success: false},
  { t: 1540923810946, value: 20, success: false},
  { t: 1550923810946, value: 20, success: true},
  { t: 1510923810946, value: 60, success: false},
  { t: 1510923910946, value: 20, success: true},
  { t: 1510933810946, value: 90, success: true},
  { t: 1510943810946, value: 20, success: true},
  { t: 1510923810956, value: 20, success: true},
]

const markers = [
  { t: 1510923910947 },
  { t: 1510923820956 },
  { t: 1510923810966 },

]

export default () => (
  <Layout>
    <Container>
    foo

        <SuccessesAndFailuresBars
          data={data}
          markers={markers}
          maxBars={15}
        />

    </Container>
  </Layout>
)
