import React from 'react'

const color = tests => {
  const sum = tests.map(t => t.lastresult === 'success' ? 1 : 0).reduce((sum, i) => (sum + i), 0)
  if (sum === 0) return 'red'
  if (sum === tests.length) return 'green'
  return 'orange'
}

const TocBadge = ({tests}) =>
  <span className="TocBadge">
    {tests.length}
    <style jsx>{`
    .TocBadge {
      margin-left: 2px;
      padding: 0 2px;
      border-radius: 3px;
      color: ${color(tests)};
      border: 1px solid ${color(tests)};
    }
  `}</style>
  </span>


const Toc = ({children}) =>
  <ul className="menu-list">
    {
      children && children.map((node, i) =>
        <li key={i}>
          <a href={`#${node.path}`}>
            {node.name}

            { node.tests && node.tests.length &&
              <TocBadge tests={node.tests}></TocBadge>
            }

          </a>

          <Toc children={node.children} />
        </li>
      )
    }
  </ul>

export default ({toc}) =>
  <div className="menu is-size-7">
    <Toc children={toc.children} />
  </div>
