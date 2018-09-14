import React from 'react'

const Toc = ({children}) =>
  <ul className="menu-list">
    {
      children && children.map((node, i) =>
        <li key={i}>
            {node.name}

          <Toc children={node.children} />
        </li>
      )
    }
  </ul>

export default ({toc}) =>
  <div className="menu is-size-7">
    <Toc children={toc.children} />
  </div>
