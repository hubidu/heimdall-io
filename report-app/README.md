## DONE
- Filter by project and ownerKey in url
- Show browser name in reports
- Be able to use the reporter for local test runs (i. e. use a personalized key when running the tests, tag the test results with the key, transfer the test results to the server)
- report-service: go panic
  runtime error: index out of range
  report-service_1      | C:/Go/src/runtime/panic.go:489 (0x42877f)
  report-service_1      | C:/Go/src/runtime/panic.go:28 (0x4273fe)
  report-service_1      | C:/Users/stefan.huber/go/src/github.com/hubidu/e2e-backend/report-service/routes/projects.go:62 (0x981c90)
  report-service_1      | C:/Users/stefan.huber/go/src/github.com/gin-gonic/gin/context.go:107 (0x8f2bba)
  report-service_1      | C:/Users/stefan.huber/go/src/github.com/hubidu/e2e-backend/report-lib/middlewares/middlewares.go:23 (0x97ffef)
  report-service_1      | C:/Users/stefan.huber/go/src/github.com/gin-gonic/gin/context.go:107 (0x8f2bba)
- report list: Show error message even if there are no steps
- report list: Show tags
- Show label for environment
- Mark corresponding part of the test in the code
- Link Page url and title
- Need a magnifying glass or open screenshot in separate tab
- Make a nice progress bar
- Format filepath as <filename> - <path>
- source code file name is incorrect

## In Progress

- Show user name
- report details: Show browser log entries (webdriverio and puppeteer are different)
- Crop test code
- Show success/failure bars per device
- Make success/failure bars smaller/narrower
- report list: Group failed tests by prefix
- report list: Make expected/actual expandable
- details: when test failed: Provide a link to the last successful run

## Backlog
- Source Code view: Show all stackframes except that of test
- report not showing ALL reports (http://veve-dev-test-01.intern.v.check24.de:4000/tests?ownerkey=sIzM3ZEHRb&project=%23All)
- codeceptjs: report not grouping same test in different projects correctly
- projects: Add environments
- report details: Show time of last successful test
- Add and show time delta between screenshots (in red if time > 5s)
- Improve time travel detail view: Highlight selected step
- Detail View: Filter by device
- Enhance alerting: Dont send alert if last test run has been successful
- Enhance alerting: Add all failing tests to report
- Enhance alerting: Show times of all test failures
- Enable users to put tests into quarantine
- ava-codeceptjs: If click is used with two parameters, then use waitForText instead of waitForVisible
- ava-codeceptjs: Tag each test run with a unique identifier
- ava-codeceptjs: Automatically retry test on a (different?) device
- ava-codeceptjs: Tag tests as integration test
- Show last errors on other devices
- Show last change date of test files
- Make mongodb query more efficient
- Cleanup report database regularly
- Mark known failures (use screenshot hashid)
- Show compact source code snippet as <line in test> -> <line in page object>
- Do a side by side compare of a failed and successful test run
- Display exact date in details
- Link to test details using hashcategory
- Show screenshot shotAt delta
- Filter by environment
- Filter by device
- exclude known problems from failures (ESOCKETTIMEOUT)
- Improve report file cleanup (keep last successful and all errors)
- Mark same error as current in previous failures
- Refresh page automatically
- Ability to hide/quarantine failing tests (also do automatically after X failures)
- Show more info about the test in success/failure bars popover
- Rerun failing tests
- Looks like deployment info is not always reliable (some deployments are not showing up)
- Add label to deployment bars
- ava-codeceptjs should also log command/function name and parameters
- Detail View: Merge browser logs into screenshot timeline?
- NEW Show also released tickets/stories in timeline
- Add a hash id for errors
- Display if test is known to fail with this error
- Group tests by time (just now, recently, some time ago)
- FEAT Filter tests by device
- Show last update of test project
- Add failure rate per test
- Show test status per device in tree view
- FEAT Provide an overview of available screenshots in s source code view
- Fade out "old" tests (where the last run is old and the test has been renamed or deleted)
- Compare steps of failed run with previous successful run
- IDEA Create a notification application which also works on the report data
- Improve error messages by adding the failed step + args to the error message (e. g. element not visible [but which element?])
- Fix scrollbars (hat mit den popovers zu tun)
