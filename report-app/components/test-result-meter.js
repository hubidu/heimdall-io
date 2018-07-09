export default ({errorPct}) =>
  <div className="TestResultMeter">
    <div className="TestResultMeter-bar" style={{width: `${errorPct}%`}}></div>

    <style jsx>{`
    .TestResultMeter {
      border-radius: 5px;
      margin-bottom: 10px;
      height: 0.2em;
      background-color: #23d160;
    }
    .TestResultMeter-bar {
      border-radius: 5px;
      height: 100%;
      background-color: #ff3860;
      // width: 50%;
    }
    `}</style>
  </div>
