import moment from 'moment'

export default ({event}) =>
  <div className="br-pill ba b--light-blue black-60 pa2 mv2">
    <div className="cf cf-ns nl2 nr2">
      <div className="fl-ns w-10-ns ph2 f6">
      <strong>
        {event.ProjectName}
      </strong>
      <br/>
      {event.Version}
      </div>
      <div className="fl-ns w-70-ns ph2">
        <div dangerouslySetInnerHTML={{__html: event.Description}} />

      </div>
      <div className="fl-ns w-20-ns ph2 f6">
        {moment(event.FinishedAt).format('llll')}
      </div>
    </div>
  </div>
