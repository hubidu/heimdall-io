import Pie from './pie'
import TreeLeaf from './tree-leaf'

const Tree = ({ className, node }) =>
    <ul className={`list pl2 ${className}`}>
    {
        Object.keys(node)
            .filter(key => !key.startsWith('_'))
            .map(subnodeName => node[subnodeName])
            .map((subnode, i) =>
            subnode._test ?
                <li key={i} className="cf">
                  <TreeLeaf node={subnode} />
                </li>
                :
                <li className="mt2 cf" key={i}>
                    <h5 className="mv1 black-90">
                        <Pie className="mr2" pct={subnode._meta.successPct * 100} />
                        {subnode._meta.label}
                    </h5>

                    <Tree node={subnode} />
                </li>
        )
    }
    </ul>

export default Tree
