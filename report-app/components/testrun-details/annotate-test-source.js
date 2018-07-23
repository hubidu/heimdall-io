import lastOf from '../../services/utils/last-of'

const _getPathToTestSourceFile = screenshots => lastOf(lastOf(screenshots).CodeStack).Location.File

const _buildMappingBetweenLinesAndScreenshots = (sourceLines, screenshots) => {

  const PathToTestSourceFile = _getPathToTestSourceFile(screenshots)

  const isScreenshotWithTestStackframe = lineNo =>
    screenshot => {
      for (let cs of screenshot.CodeStack) {
        if (cs.Location.Line === lineNo && cs.Location.File === PathToTestSourceFile)
          return true
      }
      return false
    }
  const getScreenshotIndexOfLine = lineNo => screenshots.findIndex(isScreenshotWithTestStackframe(lineNo))

  /**
   * Build a mapping of source code lines to screenshots. A screenshot is mapped to a line
   * if one of the stacktraces in the screenshot references the source code line
   */
  const linesToScreenshotIndexes = sourceLines.map((l, i) => {
    const screenshotIndex = getScreenshotIndexOfLine(i + 1)
    return screenshotIndex > -1 ? {
      lineNo: i + 1,
      idx: screenshotIndex,
    } : undefined
  })
  console.log('Lines to screenshot indexes', linesToScreenshotIndexes)
  // Just keep the lines which actually have screenshots
  const screenshotIndexes = linesToScreenshotIndexes.filter(index => !!index)
  console.log('Screenshot indexes', screenshots.length, screenshotIndexes)

  /**
   * Finally assign screenshots to lines. Subsume all screenshots not directly associated with a line (through a stacktrace)
   * to the first of two lines.
   */
  const linesToAllScreenshots = []
  for (let i = 0; i < screenshotIndexes.length; i++) {
    if (screenshotIndexes[i + 1] !== undefined && screenshotIndexes[i].idx !== screenshotIndexes[i + 1].idx)   {
      const sl = screenshots.slice(screenshotIndexes[i + 1].idx + 1, screenshotIndexes[i].idx + 1)

      linesToAllScreenshots.push(Object.assign(screenshotIndexes[i], {
        screenshots: sl,
      }))
    } else {
      const sl = screenshots.slice(0, screenshotIndexes[i].idx + 1)
      linesToAllScreenshots.push(Object.assign(screenshotIndexes[i], {
        screenshots: sl,
      }))
    }
  }

  console.log('Groups', linesToAllScreenshots)
  return linesToAllScreenshots
}

/**
 * Annotate lines in the test source where we have a screenshot
 */
const annotateSource = (source, screenshots, screenshotsDiff) => {

  if (!source) return []

  const sourceLines = source.split('\n')

  const linesToAllScreenshots = _buildMappingBetweenLinesAndScreenshots(sourceLines, screenshots)
  const linesToAllScreenshotsDiff = _buildMappingBetweenLinesAndScreenshots(sourceLines, screenshotsDiff)

  const annotatedSourceLines = sourceLines.map((l, i) => {
    const meta = linesToAllScreenshots.find(ssgroup => ssgroup.lineNo === i + 1)
    return Object.assign({}, {
      lineNo: i + 1,
      source: l,
      meta: meta ? meta.screenshots : undefined,
      // metaDiff: screenshotsDiff ? getMetadataForLine(screenshotsDiff, i + 1) : undefined
    })
  })

  console.log('Annotated', annotatedSourceLines)

  return annotatedSourceLines
}

/**
 * FInd contiguous sets of annotated and not annotated lines
 */
const getLineGroupRanges = annotatedSourceLines => {
  if (annotatedSourceLines.length === 0) return []

  const result = []
  const lineFlags = annotatedSourceLines.map(l => l.meta ? 1 : 0)

  let currentValue = lastOf(lineFlags)
  while(currentValue !== undefined) {
    let c = 0

    while(currentValue === lastOf(lineFlags)) {
      c++
      lineFlags.pop()
    }
    result.push(c)

    currentValue = lastOf(lineFlags)
  }

  return result.reverse()
}

/**
 * Group individual lines using the ranges
 */
const groupSourceLines = (annotatedSourceLines, lineGroupRanges) => {
  if (annotatedSourceLines.length === 0) return []

  const lineGroups = []
  let first = 0
  for (let lgRange of lineGroupRanges) {
    let len = lgRange
    const lines  = annotatedSourceLines.slice(first, first + len)

    lineGroups.push({
      first,
      len,
      lines,
      isAnnotated: lines[0].meta !== undefined
    })

    first = first + lgRange
  }

  return lineGroups
}

/**
 * PUBLIC
 */

export const getEditorState = (annotatedSource, screenshots) => {
  const getMaxLine = lines => {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].meta) return i +1
    }
    return -1
  }
  const getMinLine = lines => lines.findIndex(l => l.meta)
  const maxLine = getMaxLine(annotatedSource)
  const minLine = getMinLine(annotatedSource)
  const filepath = _getPathToTestSourceFile(screenshots)

  return {
    lineRange: [minLine, maxLine],
    selectedLine: maxLine,
    filepath,
  }
}

export const annotateTestSource = (source, reportScreenshots, diffReportScreenshots) => {
  const annotatedSource = annotateSource(source, reportScreenshots, diffReportScreenshots)
  const lineGroupRanges = getLineGroupRanges(annotatedSource)
  const groupedAnnotatedSource = groupSourceLines(annotatedSource, lineGroupRanges)
  return { lines: annotatedSource, lineGroups: groupedAnnotatedSource };
}

