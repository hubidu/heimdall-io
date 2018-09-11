import lastOf from './utils/last-of'

export const getPathToTestSourceFile = screenshots => {
  for (let ss of screenshots) {
    for (let cs of ss.CodeStack) {
      if (cs.Location.File.match(/\.test\.js/)) {
        return cs.Location.File
      }
    }
  }
  // let lastScreenshot = lastOf(screenshots)
  // if (lastScreenshot.CodeStack.length === 0) {
  //   // HACK Take before last screenshot
  //   const nextToLast = lastOf(screenshots, 2)
  //   return lastOf(nextToLast.CodeStack).Location.File
  // }
  // return lastOf(lastScreenshot.CodeStack).Location.File
}
