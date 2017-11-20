const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const capitalize = nodeName => {
  const parts = nodeName.split(/-/)
  return parts.map(capitalizeFirstLetter).join(' ')
}

const propagateTestResults = (node, nodeName = 'root') => {
  if (node['_test']) {
    const test = node['_test']

    return {
      success: (test.result === 'success' && test.type === 'test') ? 1 : 0,
      error: (test.result === 'error' && test.type === 'test') ? 1 : 0,
      todo: test.type === 'todo' ? 1 : 0,
    }
  }

  const subnodeNames = Object.keys(node).filter(key => !key.startsWith('_'))
  const subnodes = subnodeNames.map(name => node[name])

  const subnodeResults = subnodes.map((subnode, i) => propagateTestResults(subnode, subnodeNames[i]))
  const aggregatedResult = subnodeResults.reduce((agg, subnodeResult) => {
    agg.success += subnodeResult.success
    agg.error += subnodeResult.error
    agg.todo += subnodeResult.todo
    agg.successPct = agg.success / (agg.success + agg.error + agg.todo)
    return agg
  }, { success: 0, error: 0, todo: 0 })

  node._meta = Object.assign({
    label: capitalize(nodeName)
  }, aggregatedResult)

  return aggregatedResult
}

// Obsolete
export default (testRuns, deviceType = 'desktop') => {
  const byDeviceType = test => test.deviceSettings && test.deviceSettings.type === deviceType
  // Get the latest test run
  const tests = testRuns
                  .map(test => Object.assign({}, test.runs.filter(byDeviceType)[0])).filter(test => !!test)

  const tree = tests.reduce((result, test) => {
    const prefixes = test.fullTitle.split(/\s*--\s*/)
    const prefixesAndTest = prefixes.concat(test)

    prefixesAndTest.reduce((agg, prefixOrTest) => {
      if (typeof prefixOrTest === 'object') {
        agg['_test'] = prefixOrTest
        return agg
      } else {
        agg[prefixOrTest] = agg[prefixOrTest] ? agg[prefixOrTest] : {}
        return agg[prefixOrTest]
      }
    }, result)

    return result
  }, {})

  propagateTestResults(tree)


  return tree
}
