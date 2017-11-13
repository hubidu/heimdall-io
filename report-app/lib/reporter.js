const _ = require('lodash')
const fs = require('fs');
const path = require('path');

const walk = (dir, opts = { listDirs: true, listFiles: true, onlyNonEmptyDirs: false }, done) => {
  let results = []
  
  fs.readdir(dir, (err, list) => {
    if (err) return done(err)
    let pending = list.length
    if (!pending) return done(null, results)

    list.forEach((file) => {
      file = path.resolve(dir, file);

      fs.stat(file, (err, stat) =>  {
        if (stat && stat.isDirectory()) {
          if (opts.listDirs) results.push(file)

          walk(file, opts, (err, res) => {
            if (res.length > 0) {
                if (opts.onlyNonEmptyDirs) results.splice(results.indexOf(file), 1)
                results = results.concat(res)
            } 
            if (!--pending) done(null, results)
          });
        } else {
          if (opts.listFiles) results.push(file)
          if (!--pending) done(null, results)
        }
      });
    });
  });
};

const listFiles = dir => new Promise((resolve, reject) => {
    walk(dir, { listDirs: false, listFiles: true }, (err, list) => {
        if (err) return reject(err)
        resolve(list)
    })    
})

const listTestDirs = baseDir => new Promise((resolve, reject) => {
        walk(baseDir, { listDirs: true, onlyNonEmptyDirs: true }, (err, list) => {
            if (err) return reject(err)
            resolve(list)
        })
    })

/**
 * Read json report files from the output directory and do some
 * basic aggregation like group them by test name and within
 * the group order by startDate
 */
module.exports = async baseDir => {
    const absPath = path.resolve(baseDir)
    const testDirs = await listTestDirs(absPath)
    const reportFiles = testDirs.map(testDir => path.join(testDir, 'report.json'))
    const reports = await Promise.all(reportFiles.map(f => {
        return new Promise((resolve, reject) => {
            fs.readFile(f, 'utf8', async (err, content) => {
                if (err) return resolve(undefined) // Maybe should log the error

                const testDir = path.dirname(f)
                // const screenshots = (await listFiles(testDir)).map(f => path.basename(f)).filter(f => f.match(/.png/))
                const reportJson = JSON.parse(content)


                reportJson.path = testDir.replace(absPath, '').replace(/\\/g, '/')
                // reportJson.screenshots = screenshots
                resolve(reportJson)
            })
        })
    }));
    onlyReports = reports.filter(r => !!r)
    const groupedReports = _.groupBy(onlyReports, 'fullTitle')

    const groupedAndSortedReports = _.map(groupedReports, (reportsInGroup, groupName) => {
        const sortedTestruns = _.sortBy(reportsInGroup, 'startedAt').reverse()
        return {
            title: groupName,
            runs: sortedTestruns 
        }
    })

    return _.sortBy(groupedAndSortedReports, 'title')
}