import FirefoxIcon from 'react-icons/lib/fa/firefox'
import ChromeIcon from 'react-icons/lib/fa/chrome'
import InternetExplorerIcon from 'react-icons/lib/fa/internet-explorer'
import SafariIcon from 'react-icons/lib/fa/safari'
import TestDeviceIcon from './test-device-icon';

const formatDeviceSettings = ds => ds ? `
${ds.Name || '-'}/${ds.Type}

${ds.Browser || 'Unknown Browser'} (${ds.BrowserVersion || '<unknown version>'})
${ds.Width}x${ds.Height}
${ds.Os || ''}
` : ''

export default ({result, deviceSettings}) => {
  const color = (result === 'error' || result === false) ? 'has-text-danger' : 'has-text-success'
  return (
    <div className="has-text-grey">
      <div className={`f4 mr1 ${color}`} title={formatDeviceSettings(deviceSettings)} >
        <TestDeviceIcon deviceSettings={deviceSettings} />
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
