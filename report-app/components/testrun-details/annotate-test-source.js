import lastOf from '../../services/utils/last-of'
const getPathToTestSourceFile = screenshots => lastOf(lastOf(screenshots).CodeStack).Location.File

/**
 * Annotate lines in the test source where we have a screenshot
 */
const annotateSource = (source, screenshots, screenshotsDiff) => {
  if (!source) return []

  const sourceLines = source.split('\n')
  const PathToTestSourceFile = getPathToTestSourceFile(screenshots)

  const getMetadataForLine = (screenshots, lineNo) => {
    const screenshotWithATestStackframe = screenshot => {
      const presumedTestStackframe = lastOf(screenshot.CodeStack)
      return presumedTestStackframe.Location.Line === lineNo &&
        presumedTestStackframe.Location.File === PathToTestSourceFile
    }

    const screenshot = screenshots.find(screenshotWithATestStackframe)
    return screenshot ? screenshot : undefined
  }

  return sourceLines.map((l, i) => {
    return Object.assign({}, {
      lineNo: i + 1,
      source: l,
      meta: getMetadataForLine(screenshots, i + 1),
      metaDiff: screenshotsDiff ? getMetadataForLine(screenshotsDiff, i + 1) : undefined
    })
  })
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
  const filepath = getPathToTestSourceFile(screenshots)

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

