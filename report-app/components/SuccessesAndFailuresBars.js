import moment from 'moment'
import styled from 'styled-components'

const capValue = val => val >= 1.0 ? 1.0 : val

const defaultLabelFormatFn = d => moment(d.t).fromNow() + ', ' + d.value + ' s'

const BarWidth = 10
const BarGap = 2
const Height = 20

const color = success => success ? '#19a974' : '#ff6300'
const selectedColor = selected => selected ? 'blue' : '#eee'
const byDate = (a, b) => {
  return a.t - b.t
}
const desc = sortFn => (a, b) => -1 * sortFn(a, b)

export default ({ data, markers = [], selectedBar = -1, labelFormatFn = defaultLabelFormatFn, maxBars = 10, maxValue = 120, onBarClicked = () => {} }) => {
  let mappedData = [...data, ...markers].sort(desc(byDate)).slice(0, maxBars - 1)

  let i = mappedData.length - 1
  while (i > 0) {
    if (mappedData[i].value === undefined) {
      mappedData[i] = undefined
      i = i - 1
    } else {
      break
    }
  }
  mappedData = mappedData.filter(m => !!m)

  return (
      <div style={{display: 'inline-block', 'lineHeight': 1, 'verticalAlign': 'baseline', height: `${Height}px`, width: `${maxBars * (BarWidth + BarGap)}px`}}>
      {
        mappedData.map((d, i) =>
          <a href={d.href} key={i}
            style={{'position': 'relative', display: 'inline-block', width: `${BarWidth}px`, 'height': `100%`, 'marginRight': `${BarGap}px`, 'backgroundColor': `#eee`, 'borderBottom': `2px solid ${selectedColor(selectedBar === i)}`}}
            title={labelFormatFn(d)}
            onClick={ev => onBarClicked(i)}
            >
                { d.value === undefined ?
                  <div style={{'position': 'absolute', 'left': `${BarWidth/2}px`,'bottom': 0, height: `${Height}px`, width: `2px`, 'backgroundColor': `#96ccff`}}
                  onClick={ev => onBarClicked(i)}
                  >
                  &nbsp;
                  </div>

                  :
                  <div style={{'position': 'absolute', 'bottom': 0, height: `${capValue(d.value / maxValue) * Height}px`, width: `${BarWidth}px`, 'backgroundColor': `${color(d.success)}`}}
                  onClick={ev => onBarClicked(i)}
                  >
                  &nbsp;
                  </div>
                }
          </a>
      )
      }
      </div>
  )
}

