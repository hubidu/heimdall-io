export default ({ reportId }) =>
  <a
    className="TestSourceLine-htmlSourceLink"
    href={`/html-source?id=${reportId}`}
  >
    Inspect HTML source
  </a>
