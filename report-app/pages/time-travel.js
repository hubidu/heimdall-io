import Layout from '../components/layout'
import {Container, Segment, Menu, Sidebar, List, Card, Image, Icon, Header, Label, Item} from 'semantic-ui-react'
import Collapsible from '../components/Collapsible'
import TestResultDeviceIcon from '../components/test-result-device-icon'

import getReportById from '../services/get-report-by-id'
import getScreenshotUrl from '../services/get-sceenshot-url'

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
      if (step.ReachedAt === 0) continue
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
          isErrorStep(step) && lastOf(step.Screenshots) &&
            <div className="cf mt2 courier orange ba pa1">
              <strong>
                {lastOf(step.Screenshots).Message}
              </strong>
            </div>
        }

        { step.Screenshots.length > 0 &&
            <List size="mini">
              {
                step.Screenshots.map((screenshot, i) =>
                  <List.Item key={i} onMouseOver={(e) => onScreenshotHovered && onScreenshotHovered(screenshot)}>
                    <List.Header>
                      <List.Icon name='image' size='small' verticalAlign='middle' />
                      <CommandName screenshot={step.Screenshots[i]} steps={steps} />
                    </List.Header>
                  </List.Item>
                )
              }
            </List>
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

  constructor() {
    super()
    this.state = {}

    this.onScreenshotHovered = this.onScreenshotHovered.bind(this)
  }

  onScreenshotHovered(screenshot) {
    this.setState({
      hoveredScreenshot: screenshot
    })
  }

  render () {
    return (
      <Container>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.</p>

        <div className="Report">

        <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} animation='slide out' width='thin' visible={true} icon='labeled' vertical inverted>
          <Menu.Item name='home'>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item name='gamepad'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item name='camera'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>
            <Header as='h3'>Application Content</Header>
            <Image src='/assets/images/wireframe/paragraph.png' />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>

          <div className="Sidebar">
            <Steps steps={this.props.stepsWithScreenshots} onScreenshotHovered={this.onScreenshotHovered} />
          </div>
          <div style={{marginLeft: "45%"}} className="Screenshot w-60">
            {
              this.state && this.state.hoveredScreenshot &&
              <Image spaced={true} fluid={true} src={getScreenshotUrl(this.props.report.ReportDir, this.state.hoveredScreenshot.Screenshot)} />
            }
          </div>
        </div>

      </Container>
      )
  }
}
