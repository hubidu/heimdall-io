import {
  FaDesktop as DesktopIcon,
  FaAndroid as AndroidIcon,
  FaApple as IOSIcon,
  FaMobileAlt as MobileIcon,
  FaTabletAlt as TabletIcon
} from 'react-icons/fa'

export default ({deviceSettings}) =>
  <span>
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
