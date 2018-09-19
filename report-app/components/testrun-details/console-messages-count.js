const createBrowserlogsDetailLink = (id) => `/logs/browser?id=${id}`

const countErrors = (messages) => messages.filter(m => m.level === 'SEVERE' && m.message.match(/status of 5\d\d/)).length
const countWarnings = (messages) => messages.filter(m => ['SEVERE', 'WARNING'].indexOf(m.level) >= 0 && !m.message.match(/status of 5\d\d/)).length
const count = (messages, level) => messages.filter(m => m.level === level).length

export default ({reportId, messages}) => {
  const errorCount = countErrors(messages)
  const warningCount = countWarnings(messages);
  const infoCount = count(messages, 'INFO');

  return (
  <a href={createBrowserlogsDetailLink(reportId)} target="_blank">
    {errorCount > 0 && <span className='has-text-danger'>
      {errorCount}
    </span>}
    &nbsp;
    {warningCount > 0 && <span className='has-text-warning'>
      {warningCount}
    </span>}
    &nbsp;
    {infoCount > 0 && <span className='has-text-info'>
      {infoCount}
    </span>}
    &nbsp;
    <span className="has-text-grey-light">
      {messages.length}
    </span>
  </a>
  )
}
