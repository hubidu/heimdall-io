import {FaCheckCircle as SuccessIcon, FaTimesCircle as FailureIcon} from 'react-icons/fa'

export default ({result}) =>
  <span className="TestResultIcon">
    {result === 'error' ? <span className="has-text-danger"><FailureIcon/></span> : <span className="has-text-success"><SuccessIcon/></span>}
  </span>
