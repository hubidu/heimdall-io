const trunc = (msg, MaxLen = 80) => {
  if (!msg) return msg
  let res = msg
  if (msg.length > MaxLen) {
    res = msg.substring(0, MaxLen) + '...'
  }
  return res
}

export default ({screenshot}) =>
  screenshot &&
  <div className="TestError">
    <p className="TestError-title has-text-danger is-size-6">
      '
      {
        trunc(screenshot.Message)
      }
      '
    </p>
    {
      screenshot.Expected &&
      <div>
        <div className="has-text-success">
          Expected
          &nbsp;
          <b>
            '
            {screenshot.Expected}
            '
          </b>
        </div>
        <div className="has-text-danger">
          Found
          &nbsp;
          <b>
            '
            {screenshot.Actual}
            '
          </b>
        </div>
      </div>
    }
    <style jsx>{`
    .TestError {
      margin-top: 5px;
      padding: 0 5px;
      border-left: 2px solid red;
    }

    .TestError-title {
      margin-bottom: 5px;
    }
    `}</style>

  </div>
