import {FaCheckCircle as SuccessIcon, FaTimesCircle as FailureIcon} from 'react-icons/fa'

export default ({result}) =>
  <span className="TestResultIcon">
    {result === 'error' ? <span><FailureIcon/></span> : <span><SuccessIcon/></span>}
  </span>
