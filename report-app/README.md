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
- Show user name
- Show success/failure bars per device
- Show text when source code is not available anymore
- Make success/failure bars smaller/narrower
- Make sure that stackframe is really in test when annotating source
- Crop test code
- Show the actual command parameters when source line is selected
- Redesign project page with bulma
- Show all line groups which are fully contained in the line Range
- projects: Add environments
- Source Code view: Show all stackframes except that of test
- FEATURE Delete a test project: Implement the delete routes
- FEATURE report list view: Link from bar to test details
- FEATURE Diff a failed test with the last successful one
- report details: Show browser log entries also for puppeteer (map puppeteer logs to webdriverio format)
- Implement a loading spinner
- Loading spinner for the report list page
- BUG: Diff LEDs are shown incorrectly on page load
- Check performance logs from puppeteer
- Make labels smaller
- report list: Hide expected/actual section by default
- Open screenshots in new tab on click
- Fix: List view: Fix result bar
- Fix screenshot diff view
- Test Details: Browser back triggers /report-categories ajax call
- FIX Html source view (I think I need to prevent script execution on the page)
- Source Code: Show last git commit message
- BUG: Confusing (and probably incorrect) stacktraces (check success and failure)
- BUG: Show code snippets only if location is other than test file
- BUG: Stacktraces: Dont drill down into the test source itself

## In Progress

- BUG: Diffing: Show only one screenshot if there is only one on a line
- Error View: Provide link to last error of same type on same device
- IDEA Add forward/backward buttons to quickly navigate between screenshots
- ava-codeceptjs: Try long stacktraces
- Test with ava-codeceptjs project

## Backlog Release V 2.0


## Backlog V 2.0

- Report list: Filter by device
- Report list: Filter by prefix
- Testrun history: Navigate quicker through the test history
- Testrun history: See better where in the history I am
- Last source commit: Actually would like to see last change of the test file
- Test details: Should have an indication about the test status on other devices
- IDEA Use prefix title as filter for tests/navigation
- IDEA Detect broken image links
- Source View: Could use this https://bitbucket.check24.de/s/-1746010450/ca3ded2/1/1.0/_/download/resources/com.atlassian.bitbucket.server.bitbucket-web:skipped-container/torn-edge.png to mark hidden text fragments
- Diff View: Should also diff line in source since that might be the cause for the failure
- CHORE Switch to https://github.com/conorhastings/react-syntax-highlighter
- details: when test failed: Provide a link to the last successful run
- IDEA Group data driven tests: Actually it's always the same test just with variations
- IDEA Add a mini-thumbnail bar (filmstrip) to quickly navigate between screenshots

## Backlog
- Improve Source Code View: COllapse areas without annotations
- Should see the step outline from the list view
- PRB There might be a stacktrace without a test stackframe (see "When I login with city missing Then I see my data in best sso view")
- report details: Show list of tracking requests made during test run
- report not showing ALL reports (http://veve-dev-test-01.intern.v.check24.de:4000/tests?ownerkey=sIzM3ZEHRb&project=%23All)
- codeceptjs: report not grouping same test in different projects correctly
- report details: Show time of last successful test
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
- Link to test details using hashcategory
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
