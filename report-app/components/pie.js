const Pie = ({ className = '', pct = 0, width = 25, height = 25, backgroundColor = '#ddd', color = '#19a974' }) =>
    <svg className={className} style={{ verticalAlign: 'middle', display: 'inline-block', background: `${backgroundColor}`, transform: 'rotate(-90deg)', borderRadius: '50%' }} 
        width={width} height={height}
    >
        <circle style={{ 'strokeDasharray': `${(pct * 158.0) / 100} 158`, stroke: `${color}`, fill: `${backgroundColor}`, strokeWidth: 50, transition: 'stroke-dasharray .3s ease' }}
            r="25" cx="13" cy="13" width={10} height={10} className="pie" />
    </svg>

export default Pie
