import DesktopIcon from 'react-icons/lib/fa/desktop'
import MobileIcon from 'react-icons/lib/fa/mobile'
import TabletIcon from 'react-icons/lib/fa/tablet'
import AndroidIcon from 'react-icons/lib/fa/android'
import IOSIcon from 'react-icons/lib/fa/apple'
import FirefoxIcon from 'react-icons/lib/fa/firefox'
import ChromeIcon from 'react-icons/lib/fa/chrome'
import InternetExplorerIcon from 'react-icons/lib/fa/internet-explorer'
import SafariIcon from 'react-icons/lib/fa/safari'

const formatDeviceSettings = ds => ds ? `
${ds.Name || '-'}/${ds.Type}

${ds.Browser || 'Unknown Browser'} (${ds.BrowserVersion || 'xxx'})
${ds.Width}x${ds.Height}
${ds.Os || ''}
` : ''

export default ({result, deviceSettings}) => {
  const color = (result === 'error' || result === false) ? 'has-text-danger' : 'has-text-success'
  return (
    <div className="has-text-grey">
      <div className={`f4 mr1 ${color}`} title={formatDeviceSettings(deviceSettings)} >
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
      </div>
    <div>
      {
        deviceSettings && (deviceSettings.Browser === 'chrome' || deviceSettings.Browser === '') ? <ChromeIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Browser === 'firefox' ? <FirefoxIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Browser === 'ie' ? <InternetExplorerIcon /> : null
      }
      {
        deviceSettings && deviceSettings.Browser.indexOf('safari') > -1 ? <SafariIcon /> : null
      }
      </div>
    </div>
  )
}
