import trunc from '../services/utils/trunc'

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


export default ({screenshot}) =>
  screenshot &&
  <div className="TestError">
    <div className="TestError-title has-text-danger">
      '
      {
        trunc(screenshot.Message, 120)
      }
      '
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
    }

    .TestError-title {
      margin-bottom: 5px;
    }
    `}</style>

  </div>
