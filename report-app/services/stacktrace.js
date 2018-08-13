import lastOf from './utils/last-of'

export const getPathToTestSourceFile = screenshots => {
  let lastScreenshot = lastOf(screenshots)
  if (lastScreenshot.CodeStack.length === 0) {
    // HACK Take before last screenshot
    const nextToLast = lastOf(screenshots, 2)
    return lastOf(nextToLast.CodeStack).Location.File
  }
  return lastOf(lastScreenshot.CodeStack).Location.File
}
