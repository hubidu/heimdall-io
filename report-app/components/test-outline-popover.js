import SuccessIcon from 'react-icons/lib/fa/check-circle'
import FailureIcon from 'react-icons/lib/fa/times-circle'

import Popover from './popover'

const StepResultIcon = ({result}) => {
  const color = result === 'error' || result === false ? 'orange' : 'green'

  return <span className={`mr1 ${color}`}>
    {result === 'error' || result === false ? <FailureIcon /> : <SuccessIcon />}
  </span>
}

export default ({testTitle, outline}) => {
  if (outline.steps.length === 0) return null

  return (
    <Popover>
      <h4 className="ma0 mb1">{testTitle}</h4>
      <ul className="list black-80 f6 ml1 pl1">
        {
          outline.steps.map(step =>
            <li className="mb1" key={step.name}>
              {step.success !== undefined &&
                <StepResultIcon result={step.success} />}

              {step.actualName || step.name}
            </li>
          )
        }
      </ul>
    </Popover>
  )
}
