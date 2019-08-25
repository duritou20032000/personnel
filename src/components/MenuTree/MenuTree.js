import React from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd'

const TreeNode = Tree.TreeNode

class MenuTree extends React.Component {

  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: this.props.initData,
    selectedKeys: [],
  }
  onExpand = (expandedKeys) => {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
      selectedKeys: [],
    })

    this.props.getData(checkedKeys)
  }
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys })
  }

  render () {

    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.title} disableCheckbox={item.key === '0-0-0'}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={item.title} />
    })
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        onChange={this.onChange}
      >
        {loop(this.props.gData)}
      </Tree>
    )
  }
}

MenuTree.propTypes = {
  gData: PropTypes.array,
  getData: PropTypes.func,
  initData: PropTypes.array,
}

export default MenuTree