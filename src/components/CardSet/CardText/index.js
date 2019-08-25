import React, { Component } from 'react';

import styles from './index.less';
import {TextPanel} from '../';


export default class CardText extends Component {
  state = {
      text:[
      ],
      textid:0,
  };

  componentDidMount() {

  }

  componentWillMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps){

    this.init(nextProps);
  }

  componentWillUnmount() {

  }

  init(props){
      const { init, reverse} = props;

      let text = [],textid = 0;
      for(var temp in init){

          textid = textid < init[temp]['id'] ? init[temp]['id'] : textid;
          if(init[temp]['reverse'] == reverse){
              //分正反面
              text.push({
                  id:init[temp]['id'],
                  text:init[temp]['text'],
                  family:init[temp]['family'],
                  size:init[temp]['size'],
                  color:init[temp]['color'],
                  focus:init[temp]['focus'],
                  column:init[temp]['column'],
              });
          }
      }

      text.sort(this.sortId);
      this.setState({
          textid:textid,
          text:text,
      });
  }

    //json数组排序
    sortId(a,b){
        return a.id-b.id
    }

  render() {
      const {handleUpdateText,handleAddText,handleResetText,handleDelText,handleColorPicker} = this.props;

      /**
       * 删除一个text
       */
      const textPanelProps = {
          handleClickByDelete:function(index){
              //删除面板
              var text = this.state.text;
              text = text.filter(item => item.id != index);
              this.setState({
                  text:text
              })

              handleDelText(index);
          }.bind(this),

          handleClickByReset:function(index, family, value, size, style, focus){

              handleResetText(index, family, value, size, style, focus);
          },

          handleClickByActive:function(index){

              //重新设置主面板text并显示选中框
              handleUpdateText(index);
          }.bind(this),
          handleColorPicker:handleColorPicker,
      }

      /**
       * 添加一个Logo
       */
      const handleClickByAdd = () =>{
          let text = this.state.text;
          let index = Math.random()*100;

          //添加数据
          text.push({
              id:index,
              focus:0,
          });

          handleAddText(index);

          this.setState({
              textid:index,
              text:text,
          });

      }

      const textpanel = this.state.text.map(item=><TextPanel
          key = {item.id}
          id = {item.id}
          focus = {item.focus}
          text = {item.text}
          family = {item.family}
          color = {item.color}
          size = {item.size}
          column = {item.column}
          {...textPanelProps}/>);

      return (
          <div className={styles.textItems}>
            <ul>
                {textpanel}
            </ul>
            <a href="javascript:;" className={styles.addLogoButton} onClick={() => handleClickByAdd()}>添加一行文字</a>
          </div>
      );
  }
}
