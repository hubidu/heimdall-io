import lastOf from '../../services/utils/last-of'

const _hasMeta = l => (l.meta !== undefined || l.metaDiff !== undefined)

const _getPathToTestSourceFile = screenshots => lastOf(lastOf(screenshots).CodeStack).Location.File

const _buildMappingBetweenLinesAndScreenshots = (sourceLines, screenshots) => {
  if (!screenshots) return []

  const PathToTestSourceFile = _getPathToTestSourceFile(screenshots)

  const isScreenshotWhichHasAStackframeInTheTestSource = lineNo =>
    screenshot => {
      for (let cs of screenshot.CodeStack) {
        if (cs.Location.Line === lineNo && cs.Location.File === PathToTestSourceFile)
          return true
      }
      return false
    }
  const getScreenshotIndexOfLine = lineNo => screenshots.findIndex(isScreenshotWhichHasAStackframeInTheTestSource(lineNo))

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
  // console.log('Lines to screenshot indexes', linesToScreenshotIndexes)
  // Just keep the lines which actually have screenshots
  const screenshotIndexes = linesToScreenshotIndexes.filter(index => !!index)
  console.log('Screenshot indexes', screenshots.length, screenshotIndexes)

  /**
   * Finally assign screenshots to lines. Subsume all screenshots not directly associated with a line (through a stacktrace)
   * to the first of two lines.
   */
  const linesToAllScreenshots = []
  for (let i = 0; i < screenshotIndexes.length; i++) {
    if (screenshotIndexes[i + 1] !== undefined)   {
      const currentLineScreenshotIndex = screenshotIndexes[i].idx + 1 // the current (including)
      const nextLineScreenshotIndex = screenshotIndexes[i + 1].idx + 1 // and the next line (not including)

      if (currentLineScreenshotIndex >= nextLineScreenshotIndex) {
        // Get all screenshots occurring between ...
        const sl = screenshots.slice(nextLineScreenshotIndex, currentLineScreenshotIndex)

        linesToAllScreenshots.push(Object.assign({}, screenshotIndexes[i], {
          screenshots: sl,
        }))
      } else {
        // SHOULD NOT HAPPEN, BUT DOES: the currentLineScreenshotIndex is smaller than the nextLineScreenshotIndex
        // Just use the screenshot directly on the current line
        const sl = [screenshots[screenshotIndexes[i].idx]]

        linesToAllScreenshots.push(Object.assign({}, screenshotIndexes[i], {
          screenshots: sl,
        }))
      }
    } else {
      const sl = screenshots.slice(0, screenshotIndexes[i].idx + 1)
      linesToAllScreenshots.push(Object.assign({}, screenshotIndexes[i], {
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
    const metaDiff = linesToAllScreenshotsDiff.find(ssgroup => ssgroup.lineNo === i + 1)

    return Object.assign({}, {
      lineNo: i + 1,
      source: l,
      meta: meta ? meta.screenshots : undefined,
      metaDiff: metaDiff ? metaDiff.screenshots : undefined,
    })
  })

  // console.log('Annotated', annotatedSourceLines)

  return annotatedSourceLines
}

/**
 * FInd contiguous sets of annotated and not annotated lines
 */
const getLineGroupRanges = annotatedSourceLines => {
  if (annotatedSourceLines.length === 0) return []

  const result = []
  const lineFlags = annotatedSourceLines.map(l => _hasMeta(l) ? 1 : 0)

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
      isAnnotated: _hasMeta(lines[0])
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
      if (_hasMeta(lines[i])) return i + 1
    }
    return -1
  }
  const getMinLine = lines => lines.findIndex(l => _hasMeta(l))
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

