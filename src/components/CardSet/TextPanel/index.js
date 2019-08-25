import React, { Component } from 'react';

import styles from './index.less';


export default class TextPanel extends Component {
  state = {
      text:"",
      family:"楷体",
      style:"normal",
      size:"16px",
      display:"none",
      color:"black",
      panelStyle:styles.textItem,
      column:"normal",
  };

  componentWillMount() {

      this.setState({
          id:this.props.id,
          text:this.props.text,
          family:this.props.family,
          color:this.props.color,
          size:this.props.size,
          column:this.props.column,
      })
  }

  componentWillReceiveProps(nextProps){

      if(nextProps.focus){
          this.setState({
              display:"block",
              panelStyle:styles.textItem + " " + styles.textItemFocus,
          })
      }else{
          this.setState({
              display:"none",
              panelStyle:styles.textItem,
          })
      }

      this.setState({
          id:nextProps.id,
          text:nextProps.text,
          family:nextProps.family,
          size:nextProps.size,
          color:nextProps.color,
          focus:nextProps.focus,
      })
  }

  componentDidMount(){

      let size = this.state.size,id = this.state.id,family = this.state.family;
      id = id?id:1;
      size = size?parseInt(size):16;
      family = family?family:"微软雅黑";
      let option = document.getElementById("FontSizeList"+id).getElementsByTagName("option");
      for(let temp in option){
          if(option[temp].value==size){
              option[temp].selected = true;
          }
      }

      let font = document.getElementById("ddlFontList"+id).getElementsByTagName("option");
      for(let temp in font){
          if(font[temp].value==family){
              font[temp].selected = true;
          }
      }
  }

  componentWillUnmount() {

  }

  render() {

    const { id, focus, family, size, handleClickByDelete, handleClickByReset, handleClickByActive, handleColorPicker } = this.props;

    const handleChange = (event,flag) =>{

        let text = this.state.text,
            family = this.state.family,
            style = this.state.style,
            size = this.state.size;

        if(flag==1){

            let value = event.target.value;
            //获取文本输入
            this.setState({
                text:value,
            })

            text = value;
        }else if(flag==2){

            let value = event.target.value;
            //获取字体输入
            this.setState({
                family:value,
            })

            family = value;
        }else if(flag==3){

            let value = event.target.value;
            //获取字体输入
            value = value + "px";
            this.setState({
                size:value,
            })

            size = value;
        }else if(flag==4){
            if(style=="normal"){
                style = "italic";
            }else{
                style = "normal";
            }
            this.setState({
                style:style,
            })

        }

        handleClickByReset(id, family, text, size, style, focus);
    }

    const inputFocus = (event) =>{

        this.setState({
            display:"block",
            panelStyle:styles.textItem + " " + styles.textItemFocus,
        })
        handleClickByActive(id);
    }

    const handlePicker = () =>{

        handleColorPicker(this.state.id);
    }

    return (
        <li className={this.state.panelStyle}>
            <input onChange={(e) => handleChange(e,1)} onFocus={(e) => inputFocus(e)} value={this.state.text} readOnly={this.state.column=="normal"?false:true}/>
            <a href="javascript:;" title="删除" id="hide-1-text-0" onClick={() => handleClickByDelete(id)}></a>
            <div id="SetFontStyleTool" style={{marginLeft: "5px",display:this.state.display}}>
                <select id={"ddlFontList"+id} onChange={(e) => handleChange(e,2)}>
                    <option value="仿宋">仿宋</option>
                    <option value="华文仿宋">华文仿宋</option>
                    <option value="华文宋体">华文宋体</option>
                    <option value="华文新魏">华文新魏</option>
                    <option value="华文楷体">华文楷体</option>
                    <option value="华文行楷">华文行楷</option>
                    <option value="华文隶书">华文隶书</option>
                    <option value="微软雅黑">微软雅黑</option>
                    <option value="隶书">隶书</option>
                    <option value="楷体">楷体</option>
                    <option value="黑体">黑体</option>
                </select>
                <select id={"FontSizeList"+id} onChange={(e) => handleChange(e,3)}>
                    <option value="6">6px</option>
                    <option value="7">7px</option>
                    <option value="8">8px</option>
                    <option value="9">9px</option>
                    <option value="10">10px</option>
                    <option value="11">11px</option>
                    <option value="12">12px</option>
                    <option value="13">13px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="22">22px</option>
                    <option value="24">24px</option>
                    <option value="26">26px</option>
                    <option value="28">28px</option>
                    <option value="30">30px</option>
                    <option value="32">32px</option>
                    <option value="34">34px</option>
                    <option value="36">36px</option>
                    <option value="38">38px</option>
                    <option value="40">40px</option>
                    <option value="42">42px</option>
                    <option value="44">44px</option>
                    <option value="46">46px</option>
                    <option value="48">48px</option>
                    <option value="50">50px</option>
                    <option value="52">52px</option>
                </select>
                <div id="FontStyle">
                    <input type="checkbox" id="IsBold" style={{display:"none"}} />
                    <label style={{display:"none"}} ><span >B</span></label>
                    <input type="checkbox" id="IsItalic"/>
                    <label><span  className={this.state.style=="normal"?styles.uiState:styles.uiStateActive} onClick={(e) => handleChange(e,4)}>I</span></label>
                    <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.color}} onClick={() => handlePicker()}><span></span></div>
                </div>
            </div>
        </li>
    );
  }
}
