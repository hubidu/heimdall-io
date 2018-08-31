class SeeMore extends React.Component {
  constructor(props) {
      super(props)

      this.state = {
          visible: props.visible || false
      }
  }

  handleClick(ev) {
      this.setState({visible: !this.state.visible})
  }

  render() {

      return (
          <span className="ShowMore has-text-link">
              <span className={'link dim blue pointer mt0 mb1 f7'} onClick={this.handleClick.bind(this)}>
                  {
                      this.state.visible ? 'hide' : 'more'
                  }

                  {this.props.label}
              </span>

              {this.state.visible ? this.props.children : null}

              <style jsx>{`
              .ShowMore {
                cursor: pointer;
              }
              `}</style>

          </span>
      )
  }
}

const getBreadcrumbPathToError = screenshot => {
  const clearSourceLine = srcline => srcline.replace('await', '').replace(/\/\/.*/, '')
  const codeStack = Object.assign(screenshot.CodeStack)

  return codeStack.map(cs => {
    let lineAsStr = cs.Source.find(source => source.Line === cs.Location.Line).Value
    lineAsStr = clearSourceLine(lineAsStr)
    return lineAsStr
  })
  .reverse()
}

export default ({screenshot, showBreadcrumbs = false}) =>
  screenshot && screenshot.Message &&
  <div className="TestError">
    {
      showBreadcrumbs &&
      <div className="TestError-breadcrumbs">
        at
        {
          getBreadcrumbPathToError(screenshot).map((breadcrumb, i) =>
            <span key={i}>
              { i > 0 ? <strong className="has-text-info">&nbsp;|&gt;&nbsp;</strong> : undefined }
              <span className="has-text-grey-light">{breadcrumb}</span>
            </span>
          )
        }
      </div>
    }
    <div className="TestError-title has-text-danger">
      {screenshot.Message}

      &nbsp;
      {
        screenshot.Expected &&
        <SeeMore>
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
        </SeeMore>
      }

    </div>


    <style jsx>{`
    .TestError {
      margin-top: 5px;
      padding: 0 5px;
      border-left: 2px solid red;
      font-family: roboto, noto;
      word-wrap: break-word;
    }

    .TestError-title {
      margin-bottom: 5px;
    }
    `}</style>

  </div>
