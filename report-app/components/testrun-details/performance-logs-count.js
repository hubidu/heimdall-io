const createPerformanceLogsDetailLink = (id) => `/logs/performance?id=${id}`

export default ({reportId, logs}) => logs ?
  <a href={createPerformanceLogsDetailLink(reportId)} >
    <span className="has-text-grey-light">
      {logs && logs.length}
    </span>
  </a>
  :
  null
