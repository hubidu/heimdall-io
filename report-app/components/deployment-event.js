import moment from 'moment'

export default ({event}) =>
  <div className="ba b--light-blue black-60 pa1 mv2">
    <div className="cf cf-ns nl2 nr2">
      <div className="fl-ns w-30-ns pl3 f6">
      <strong>
        {event.ProjectName}
      </strong>
      <br/>
      {event.Version}
      </div>
      <div className="fl-ns w-60-ns ph2">
        <div dangerouslySetInnerHTML={{__html: event.Description}} />

      </div>
      <div className="fl-ns w-10-ns ph2 f7">
        {moment(event.FinishedAt).format('llll')}
      </div>
    </div>
  </div>
