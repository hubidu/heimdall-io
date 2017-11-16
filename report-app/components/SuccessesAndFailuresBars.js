import moment from 'moment'
import styled from 'styled-components'

const BarContainer = styled.div`
    width: ${props => props.width}px;
    line-height: ${props => props.height}px;
    height: ${props => props.height}px;
    background-color: #f4f4f4;
`

const Bar = styled.span`
    display: inline-block;
    vertical-align: bottom;
    background-color: ${props => props.success === true ? 'MediumSpringGreen' : 'OrangeRed'};
    border: ${props => props.selected ? '1px solid blue' : '' };
    margin-right: ${props => props.barGap}px;
    width: ${props => props.width}px;
    height: ${props => Math.ceil(props.height)}px;
`

const capValue = val => val >= 1.0 ? 1.0 : val

const defaultLabelFormatFn = d => moment(d.t).fromNow() + ', ' + d.value + ' s'

export default ({ data, selectedBar = 0, labelFormatFn = defaultLabelFormatFn, maxBars = 10, maxValue = 120, onBarClicked = () => {} }) => {
    const BarWidth = 10
    const BarGap = 2
    const Height = 20
    const Width = maxBars * (BarWidth + BarGap)

    const dataSlice = data.slice(0, maxBars - 1)

    return (
        <BarContainer height={Height} width={Width}>
            {
                dataSlice.map((d, i) =>
                    <Bar key={i}
                        selected={selectedBar === i}
                        title={labelFormatFn(d)}
                        barGap={BarGap}
                        width={BarWidth}
                        height={capValue(d.value / maxValue) * Height}
                        success={d.success}
                        onClick={ev => onBarClicked(i)}
                    >
                    </Bar>
                )
            }
        </BarContainer>
    )
}
