import DesktopIcon from 'react-icons/lib/fa/desktop'
import MobileIcon from 'react-icons/lib/fa/mobile'
import TabletIcon from 'react-icons/lib/fa/desktop'

export default ({result, deviceSettings}) => {
  const color = (result === 'error' || result === false) ? 'orange' : 'green'

  return (
    <span className={`f4 mr1 ${color}`} title={deviceSettings ? `${deviceSettings.type} ${deviceSettings.width}x${deviceSettings.height}` : ''} >
      {
        deviceSettings && deviceSettings.type === 'desktop' ? <DesktopIcon title="foo" /> : null
      }
      {
        deviceSettings && deviceSettings.type === 'mobile' ? <MobileIcon /> : null
      }
      {
        deviceSettings && deviceSettings.type === 'tablet' ? <TabletIcon /> : null
      }
    </span>
  )
}
