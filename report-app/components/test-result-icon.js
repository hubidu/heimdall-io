import SuccessIcon from 'react-icons/lib/fa/check-circle'
import FailureIcon from 'react-icons/lib/fa/times-circle'

export default ({result}) =>
  <span>
    {result === 'error' ? <span className={'orange mr1'}><FailureIcon/></span> : <span className={'green mr1'}><SuccessIcon/></span>}
  </span>
