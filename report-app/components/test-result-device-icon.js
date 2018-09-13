
import {
  FaFirefox as FirefoxIcon,
  FaChrome as ChromeIcon,
  FaInternetExplorer as InternetExplorerIcon,
  FaSafari as SafariIcon,
} from 'react-icons/fa'


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
    <div className="TestResultDeviceIcon has-text-grey">
      <div className={`${color}`} title={formatDeviceSettings(deviceSettings)} >
        <TestDeviceIcon deviceSettings={deviceSettings} />
      </div>
    <div>
      {
        deviceSettings && (deviceSettings.Browser === 'chrome' || deviceSettings.Browser === 'chrome headless' || deviceSettings.Browser === '') ? <ChromeIcon /> : null
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
