export default ({ reportId }) =>
  <a
    className="TestSourceLine-htmlSourceLink"
    href={`/html-source?id=${reportId}`}
    target="_blank"
  >
    Inspect HTML ...

    <style jsx>{`
    .TestSourceLine-htmlSourceLink {
      cursor: pointer;
      font-family: roboto, noto;
    }
    `}</style>

  </a>
