// @deprecated


import Highlight from 'react-highlight'
import Ansi from 'ansi-to-react'
import moment from 'moment'

import ScreenshotThumbnailsWithSourceCode from './ScreenshotThumbnailsWithSourceCode'
import SuccessesAndFailuresBars from './SuccessesAndFailuresBars'
import Collapsible from './Collapsible'

import SuccessIcon from 'react-icons/lib/fa/check-circle'
import FailureIcon from 'react-icons/lib/fa/times-circle'

import { withState } from 'recompose'

const avgDuration = testRun => testRun.runs.map(run => run.duration).reduce((sum, duration) => sum + duration, 0) / testRun.runs.length
const getErrorMessage = testRun => testRun.screenshots[0].message
const currentRun = (testRun, i) => testRun.runs[i]
const mapToSuccessAndFailure = runs => runs.map(run => ({ t: run.startedAt, value: run.duration, success: run.result === 'success'}))

const enhance = withState('selectedTestRun', 'setSelectedTestRun', 0)

export default enhance(({ test, selectedTestRun, setSelectedTestRun }) => {
    const current = currentRun(test, selectedTestRun)

    return (
        <div>
            <div className="flex">
                <div className="w-70">
                    <div className={'f7 black-50'}>{current.prefix}</div>

                    <div className="flex">
                        <div className="">
                            <h2 className="mv0">
                                {current.result === 'error' ?
                                    <span className={'orange mr1'}><FailureIcon/></span> : <span className={'green mr1'}><SuccessIcon/></span>}
                            </h2>
                        </div>
                        <div className="w-90">
                            <h5 className={'black-90 mv1'}>
                                {current.title}
                            </h5>
                        </div>
                    </div>


                </div>
                <div className="w-30">
                    <div className={'f7 mt0 mb1 black-40'}>
                        last run <b>{moment(current.startedAt).fromNow()}</b>
                        &nbsp;|&nbsp;
                        <b>{test.runs.length}</b> runs
                        |&nbsp;
                        <b>{Math.floor(avgDuration(test))}s</b> avg duration
                    </div>

                    <SuccessesAndFailuresBars
                        data={mapToSuccessAndFailure(test.runs)}
                        maxBars={50}
                        selectedBar={selectedTestRun}
                        onBarClicked={barIndex => setSelectedTestRun(barIndex)}
                    />
                </div>

            </div>

            <div className="ml4">
                { currentRun(test, selectedTestRun).result === 'error' ?
                    <div>
                        <div className={'f6 ba orange b--light-red br2 mv2 pa1'}>
                            <Ansi>{getErrorMessage(current)}</Ansi>
                        </div>
                    </div>

                    : null
                }

                <Collapsible label={`Screenshots (${current.screenshots.length})`}>
                    <ScreenshotThumbnailsWithSourceCode run={current} />
                </Collapsible>

                <p>
                </p>
            </div>

        </div>
    )
})
