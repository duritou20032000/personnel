import React from 'react'
import PropTypes from 'prop-types'
import { Input, Icon, Popconfirm, message } from 'antd'
import styles from './EditableTree.less'

class EditableTree extends React.Component {

  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    liheight:32,
    treeData:this.props.initTree || [{
        title: '0-0',
        key: '0-0'}]
  }

  componentWillReceiveProps(nextProps){

      this.setState({
          treeData:nextProps.initTree,
      })

      this.autoExpand();
      this.updateTree();
  }

  autoExpand = () =>{

    //展开父节点
    if(this.state.autoExpandParent){
      let treedata = this.state.treeData,expanded = this.state.expandedKeys;

      if(treedata.length==0){
        return;
      }
      for(var temp in treedata){
          let item = treedata[temp];
          expanded.push(item['key']);
      }

      this.setState({
          expandedKeys:expanded,
          autoExpandParent:false,
      })
    }
  }

  onExpand = (e,key) => {
    //展开
    let expended = this.state.expandedKeys;
    expended.push(key);
    this.setState({
      expandedKeys:expended
    })

    this.updateTree();
  }
  onFold = (e,key) => {
      //折叠
      let expended = this.state.expandedKeys;
      let index = expended.indexOf(key);
      if(index>=0){
        expended.splice(index,1);
      }
      this.setState({
          expandedKeys:expended
      })

      this.updateTree();
  }

  updateTree = () =>{
      //更新树视图
      let expandkeys = [];

      this.resetHeight(this.state.treeData,expandkeys);
      this.setState({
          expandedKeys:expandkeys
      })
  }

  resetHeight = (data,keys) =>{
      //计算每一级动态下拉效果的高度
      let height = data.length * this.state.liheight;
      for(var temp in data){
          let item = data[temp];
          if (item.children) {
              let expendsKeys = this.state.expandedKeys;
              if(expendsKeys.indexOf(item.key)<0){
                  item.height = 0;
              }else{
                  //重新存储打开节点的key值
                  keys.push(item.key);
                  //把子节点的高度和设置到上一层节点
                  let child = this.resetHeight(item.children,keys);
                  height = height + child;
                  item.height = child;
              }
          }
      }
      return height;
  }

  onAddNode = (key) =>{
    //添加节点
    let treedata = this.state.treeData, expandkeys = this.state.expandedKeys;

    treedata = this.searchTreeAdd(treedata,key);
    expandkeys.push(key);

    this.setState({
        treeData:treedata,
        expandedKeys:expandkeys
    })

    this.updateTree();

    this.props.addNode(key);
  }

  searchTreeAdd = (data,key) =>{

      for(var temp in data){
          let item = data[temp];
          if(item.key == key){

              if(item.children){
                  let children = item.children;
                  children.push({
                      title:'新节点',
                      key:Math.random()
                  })

                  item.children = children;
              }else{
                  let children = [{
                      title:'新节点',
                      key:Math.random()
                  }];

                  item.children = children;
              }
          }else{

              if(item.children){
                item.children = this.searchTreeAdd(item.children,key);
              }
          }
    }

      return data;
  }

  onDelNode = (key) =>{
      //删除节点
      let treedata = this.state.treeData;

      treedata = this.searchTreeDel(treedata,key);

      this.setState({
          treeData:treedata
      })

      this.updateTree();

      this.props.delNode(key);
  }

    //选取图片返回路径
    onSelectImage = (path) =>{

      if(typeof this.props.onSelectImage == "function"){

          this.props.onSelectImage(path);
      }
    }

    onDelImage = (key) => {

        let treedata = this.state.treeData;

        treedata = this.searchTreeDel(treedata,key);

        this.setState({
            treeData:treedata
        })

        this.updateTree();

        if(typeof this.props.onDelImage == "function"){

            this.props.onDelImage(key);
        }
    }

  searchTreeDel = (data,key) =>{

      for(var temp in data){
          let item = data[temp];
          if(item.key == key){

              data.splice(temp,1);
          }else{

              if(item.children){
                  let children = this.searchTreeDel(item.children,key);
                  if(children.length){
                      item.children = children;
                  }else{
                     delete item.children;
                  }
              }
          }
      }

      return data;
  }

  onInputBlur = (e, key) =>{

      let treedata = this.state.treeData,value = e.target.value;
      treedata = this.searchTreeEditable(treedata,key,false,value);
      this.setState({
          treeData:treedata
      })

      this.props.updateNode(key,value);
  }

  onInputKeyDown = (e, key) =>{

    if(e && e.keyCode==13){
        let treedata = this.state.treeData,value = e.target.value;
        treedata = this.searchTreeEditable(treedata,key,false,value);
        this.setState({
            treeData:treedata
        })

        this.props.updateNode(key,value);
    }
  }

  onInputFocus = (key) =>{

    let treedata = this.state.treeData;
    treedata = this.searchTreeEditable(treedata,key,true,"");
    this.setState({
        treeData:treedata
    })
  }

  searchTreeEditable = (data,key,editable,value) =>{
      //设置树节点是否可以编辑
      for(var temp in data){
          let item = data[temp];
          if(item.key == key){
              if(!editable){
                  //text失去焦点后记录值
                  item.title = value?value:"新节点";
              }
              item.editable = editable;
          }else{

              item.editable = false;

              if(item.children){
                  item.children = this.searchTreeEditable(item.children,key,editable,value);
              }
          }
      }

      return data;
  }

  render () {

    const loop = data => data.map((item) => {
      if (item.children) {
          //如果有子元素
        if(this.state.expandedKeys.indexOf(item.key)<0){
            //如果节没展开显示文件夹
            return (
                <li key={item.key} title={item.title}>

                    <span className={styles.white}><Icon type="plus-square-o" onClick={(e) => this.onExpand(e,item.key)}/></span>
                  <div className={styles.showEdit}>
                    <span><Icon type="folder"/></span>
                    <span>{item.editable?(<Input onBlur={(e) => this.onInputBlur(e, item.key)} onKeyDown={(e) => this.onInputKeyDown(e, item.key)} autoFocus="autofocus" defaultValue={item.title}/>):item.title}</span>
                    <Icon type="plus" onClick={() => this.onAddNode(item.key)}/>
                    <Icon type="edit" onClick={() => this.onInputFocus(item.key)}/>
                    <Popconfirm placement="top" title="您确定要删除这个节点吗" onConfirm={() => this.onDelNode(item.key)} okText="是" cancelText="否">
                      <Icon type="close"/>
                    </Popconfirm>
                  </div>
                  <ul style={{height:item.height?item.height:0+"px"}}>
                      { loop(item.children) }
                  </ul>
                </li>
            )
        }else{
            //如果节点展开显示打开的文件夹
            return (
                <li key={item.key} title={item.title}>

                    <span className={styles.white}><Icon type="minus-square-o" onClick={(e) => this.onFold(e,item.key)}/></span>
                    <div className={styles.showEdit}>
                        <span><Icon type="folder-open"/></span>
                        <span>{item.editable?(<Input onBlur={(e) => this.onInputBlur(e, item.key)} onKeyDown={(e) => this.onInputKeyDown(e, item.key)} autoFocus="autofocus" defaultValue={item.title}/>):item.title}</span>
                        <Icon type="plus" onClick={() => this.onAddNode(item.key)}/>
                        <Icon type="edit" onClick={() => this.onInputFocus(item.key)}/>
                        <Popconfirm placement="top" title="您确定要删除这个节点吗" onConfirm={() => this.onDelNode(item.key)} okText="是" cancelText="否">
                            <Icon type="close"/>
                        </Popconfirm>
                    </div>
                    <ul style={{height:item.height+"px"}}>
                        { loop(item.children) }
                    </ul>
                </li>
            )
        }

      }else{
          //如果没有子元素

          if(item.type==2){
              return (
                  <li key={item.key} title={item.title}>
                      <div className={styles.showEdit}>
                          <span></span>
                          <span  onClick={() => this.onSelectImage(item.path)}><img src={item.path} className={styles.imageThumb}/></span>
                          <Popconfirm placement="top" title="您确定要删除这张图片吗" onConfirm={() => this.onDelImage(item.key)} okText="是" cancelText="否">
                              <Icon type="close"/>
                          </Popconfirm>
                      </div>
                  </li>
              )
          }else{

              return (
                  <li key={item.key} title={item.title}>
                      <div className={styles.showEdit}>
                          <span></span>
                          <span><Icon type="file"/></span>
                          <span>{item.editable?(<Input onBlur={(e) => this.onInputBlur(e, item.key)} onKeyDown={(e) => this.onInputKeyDown(e, item.key)} autoFocus="autofocus" defaultValue={item.title}/>):item.title}</span>
                          <Icon type="plus" onClick={() => this.onAddNode(item.key)}/>
                          <Icon type="edit" onClick={() => this.onInputFocus(item.key)}/>
                          <Popconfirm placement="top" title="您确定要删除这个节点吗" onConfirm={() => this.onDelNode(item.key)} okText="是" cancelText="否">
                            <Icon type="close"/>
                          </Popconfirm>
                      </div>
                  </li>
              )
          }
      }

    })
    return (
      <ul className={styles.editableTree}>
          { loop(this.state.treeData) }
      </ul>
    )
  }
}

EditableTree.propTypes = {
  addNode: PropTypes.func,
  delNode: PropTypes.func,
  updateNode: PropTypes.func,
  initTree: PropTypes.array,
}

export default EditableTree