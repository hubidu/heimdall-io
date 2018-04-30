import DesktopIcon from 'react-icons/lib/fa/desktop'
import MobileIcon from 'react-icons/lib/fa/mobile'
import TabletIcon from 'react-icons/lib/fa/tablet'
import AndroidIcon from 'react-icons/lib/fa/android'
import IOSIcon from 'react-icons/lib/fa/apple'
import FirefoxIcon from 'react-icons/lib/fa/firefox'
import ChromeIcon from 'react-icons/lib/fa/chrome'
import InternetExplorerIcon from 'react-icons/lib/fa/internet-explorer'

export default ({result, deviceSettings}) => {
  const color = (result === 'error' || result === false) ? 'orange' : 'green'
  return (
    <span className={`f4 mr1 ${color}`} title={deviceSettings ? `${deviceSettings.Type} ${deviceSettings.Width}x${deviceSettings.Height}` : ''} >
      {
        deviceSettings && (deviceSettings.Browser === 'chrome' || deviceSettings.Browser === '') ? <ChromeIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Browser === 'firefox' ? <FirefoxIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Browser === 'ie' ? <InternetExplorerIcon /> : null
      }
      &nbsp;
      {
        deviceSettings && deviceSettings.Type === 'desktop' ? <DesktopIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Type === 'mobile' ? <MobileIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Type === 'tablet' ? <TabletIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Type === 'android' ? <AndroidIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Type === 'ios' ? <IOSIcon /> : null
      }
    </span>
  )
}
