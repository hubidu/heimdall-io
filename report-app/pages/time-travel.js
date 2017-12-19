import Layout from '../components/layout'
import {List, Card, Image, Icon, Header, Label, Item} from 'semantic-ui-react'
import Collapsible from '../components/Collapsible'
import TestResultDeviceIcon from '../components/test-result-device-icon'

import getReportById from '../services/get-report-by-id'

const lastOf = items => items[items.length - 1]
const isErrorStep = step => step.Success === false && step.ReachedAt > 0
const groupScreenshotsIntoSteps = (steps, screenshots) => {
  steps.unshift({
    ReachedAt: 0,
    Success: true,
    ActualName: 'Start'
  })

  steps = steps.map(step => Object.assign(step, {
    Screenshots: []
  }))

  for (let screenshot of screenshots) {
    for (let i = steps.length - 1; i >= 0; i--) {
      let step = steps[i]
      if (screenshot.ShotAt >= step.ReachedAt) {
        step.Screenshots.unshift(screenshot)
        break;
      }
    }
  }
  return steps
}

const ResultIcon = ({step}) => {
  if (step.Success === true)
    return <List.Icon color="green" name="checkmark" />
  if (step.Success === false && step.ReachedAt > 0)
    return <List.Icon color="orange" name="remove" />
  return <List.Icon color="grey" name="circle" />
}

const CommandName = ({screenshot, steps}) => {
  return (
      <span>
        {
          screenshot.CodeStack[0].Source.find(src => src.Line === screenshot.CodeStack[0].Location.Line)
            .Value
            .replace('await', '')
            .replace('(', ' (')
            .trim()
        }
      </span>
    )
}



const Steps = ({steps, onScreenshotHovered}) =>
<div>
  <h3>Steps</h3>
  <List>
  {
    steps.map((step, i) =>
    <List.Item key={i}>
      <ResultIcon step={step} />
      <List.Content>
        <List.Header>
          {step.ActualName || step.Name}
        </List.Header>

        {
          isErrorStep(step) &&
            <div className="cf mt2 courier orange ba pa1">
              <strong>
                {lastOf(step.Screenshots).Message}
              </strong>
            </div>
        }

        { step.Screenshots.length > 0 &&
          <Collapsible label={`Show Screenshots (${step.Screenshots.length})`} visible={isErrorStep(step) ? true : false}>
            <List>
              {
                step.Screenshots.map((screenshot, i) =>

                  <List.Item>
                    <List.Header onMouseOver={(e) => onScreenshotHovered && onScreenshotHovered()} >
                      <List.Icon name='image' size='small' verticalAlign='middle' />
                      <CommandName screenshot={step.Screenshots[i]} steps={steps} />
                    </List.Header>
                  </List.Item>
                )
              }
            </List>
          </Collapsible>
        }
      </List.Content>
    </List.Item>
    )
  }
  </List>
</div>

export default class extends React.Component {
  static async getInitialProps ({ query: { id, hashcategory } }) {
    const report = await getReportById(id)

    const stepsWithScreenshots = groupScreenshotsIntoSteps(report.Outline.Steps, report.Screenshots)

    return { report, stepsWithScreenshots }
  }

  render () {
    return (
      <Layout title="Time Travel" showNav={false}>
        <div className="Report">

          <div className="Sidebar fixed w-40 bottom-0 left-0 top-0 overflow-y-scroll">
            <Steps steps={this.props.stepsWithScreenshots} />
          </div>
          <div style={{marginLeft: "45%"}} className="Screenshot w-60 bg-dark-red">
            Screenshot
          </div>
        </div>
      </Layout>
    )
  }
}
