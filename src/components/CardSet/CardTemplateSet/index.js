import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Upload, message } from 'antd';
import { CardLogo, CardCode, CardText, ColorPicker } from '../../../components/CardSet';
import { uiActive, uiselectablehelper, alignLeft, alignRight, alignTop, alignBottom, alignCenter, alignMiddle, reverse } from './common';
import {api} from '../../../utils/config';
import styles from './index.less';


export default class CardTemplateSet extends Component {
    state = {
        logo:[
        ],
        logoid:-1,
        code:[
        ],
        codeid:-1,
        text:[
        ],
        textid:-1,
        selectable:{
            sx:0,
            xy:0,
            xw:0,
            xh:0,
            display:"none",
        },
        toggle:1,
        frontimage:"",
        backimage:"",
        pickerShow:"none",
        pickerId:0,
        type:2,
    }

    componentWillReceiveProps(nextProps){

        let { data, type } = nextProps;

        if(JSON.stringify(data)!="{}"){
            //初始化数据
            let text = data.text,
                logo = data.logo,
                code = data.code,
                frontimage = data.frontimage,
                backimage = data.backimage;

            this.setState({
                logo:logo,
                text:text,
                code:code,
                frontimage:frontimage,
                backimage:backimage,
                type:type,
            })
        }else{
            //如果没有数据初始化默认数据
            this.initCard();
        }

    }

    initCard(){
        if(this.state.type==1){
            //初始化公司模板
            this.setState({
                logo:[
                    {
                        id: 1,
                        url: "../../../image/logo.png",
                        width: 52,
                        height: 52,
                        left: "10px",
                        top: "10px",
                        border: "none",
                        reverse: 1,
                    }
                ],
                code:[
                    {
                        id:1,
                        url:"../../../image/code.png",
                        width:94,
                        height:94,
                        left:"296px",
                        top:"139px",
                        border:"none",
                        reverse:1,
                    }
                ],
                text:[
                    {
                        id:1,
                        text:"某某科技有限公司",
                        size:"22px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"89px",
                        top:"28px",
                        border:"none",
                        column:"co_name",
                        reverse:1,
                    },
                    {
                        id:2,
                        text:"陈某某",
                        size:"22px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"81px",
                        border:"none",
                        column:"emp_name",
                        reverse:1,
                    },
                    {
                        id:3,
                        text:"电话：13455555555",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"219px",
                        top:"113px",
                        border:"none",
                        column:"phone",
                        reverse:1,
                    },
                    {
                        id:4,
                        text:"职位：销售经理",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"162px",
                        border:"none",
                        column:"position",
                        reverse:1,
                    },
                    {
                        id:5,
                        text:"职称：T4",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"186px",
                        border:"none",
                        column:"prof",
                        reverse:1,
                    },
                    {
                        id:6,
                        text:"地址：湖北省武汉市光谷广场",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"206px",
                        border:"none",
                        column:"normal",
                        reverse:1,
                    },
                    {
                        id:7,
                        text:"经营范围",
                        size:"22px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"149px",
                        top:"37px",
                        border:"none",
                        column:"normal",
                        reverse:2,
                    },
                    {
                        id:8,
                        text:"技术推广服务;设计、制作、代理、发布广告",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"41px",
                        top:"93px",
                        border:"none",
                        column:"normal",
                        reverse:2,
                    },
                    {
                        id:9,
                        text:"营销策划;公关策划;装饰设计;舞台设备租赁",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"41px",
                        top:"136px",
                        border:"none",
                        column:"normal",
                        reverse:2,
                    },
                    {
                        id:10,
                        text:"学历：本科",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"245px",
                        top:"84px",
                        border:"none",
                        column:"education",
                        reverse:1,
                    },
                    {
                        id:11,
                        text:"座机：000-0000000",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"113px",
                        border:"none",
                        column:"tel",
                        reverse:1,
                    },
                    {
                        id:12,
                        text:"邮箱：xxxx@xxx.com",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"29px",
                        top:"136px",
                        border:"none",
                        column:"email",
                        reverse:1,
                    },
                    {
                        id:13,
                        text:"部门：xxx",
                        size:"16px",
                        family:"楷体",
                        style:"normal",
                        color:"black",
                        left:"130px",
                        top:"84px",
                        border:"none",
                        column:"dept",
                        reverse:1,
                    },
                ],
                toggle:1,
                frontimage:"",
                backimage:"",
            })
        }else{
            //初始化个人模板
            this.setState({
                logo:[],
                code:[],
                text:[],
                toggle:1,
                frontimage:"",
                backimage:"",
            })
        }

    }

    mouseDown(event,id,flag){

        event.stopPropagation();

        var  target = event.target,
            parTarget = target.parentElement,
            disX = event.pageX - target.offsetLeft,
            disY = event.pageY - target.offsetTop,
            w = target.offsetWidth,
            h = target.offsetHeight,
            parW = parTarget.offsetWidth,
            parH = parTarget.offsetHeight,
            padding = 10;

        //设置边框
        uiActive(id,flag,this);

        document.onmousemove = function(event){
            event.preventDefault();
            event.stopPropagation();
            var l = event.pageX - disX,
                t = event.pageY - disY;
            if(l<padding){
                l = padding;
            }
            if(l>parW - w - padding){
                l = parW - w -padding;
            }

            if(t<padding){
                t = padding;
            }
            if(t>parH - h - padding){
                t = parH - h -padding;
            }

            target.style.left = l + "px";
            target.style.top = t + "px";

            //更新state里面的值
            if(flag==1){
                let logo = this.state.logo;
                logo = logo.filter(function(item){
                    if(item.id == id){
                        item.left = target.style.left;
                        item.top = target.style.top;
                    }
                    return item;
                })

                this.setState({
                    logo:logo
                })
            }else if(flag==2){
                let code = this.state.code;
                code = code.filter(function(item){
                    if(item.id == id){
                        item.left = target.style.left;
                        item.top = target.style.top;
                    }
                    return item;
                })

                this.setState({
                    code:code
                })
            }else if(flag==3){
                let text = this.state.text;
                text = text.filter(function(item){
                    if(item.id == id){
                        item.left = target.style.left;
                        item.top = target.style.top;
                    }
                    return item;
                })

                this.setState({
                    text:text
                })
            }

        }.bind(this);
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    saveTemplate = () =>{

        const { dispatch, saveTemplate } = this.props;
        //保存模板
        let textstr = JSON.stringify(this.state.text),
            logostr = JSON.stringify(this.state.logo),
            codestr = JSON.stringify(this.state.code),
            frontimage = this.state.frontimage,
            backimage = this.state.backimage;

        saveTemplate({
            text:textstr,
            logo:logostr,
            code:codestr,
            frontimage:frontimage,
            backimage:backimage,
        });
    }


  render() {
      //正面logo元素

      const logo = this.state.logo?this.state.logo.map(item =>item.reverse==1 && <img src={item.url} key={item.id} width={item.width} height={item.height}
                                                                                      style={{left:item.left,top:item.top,position:"absolute",border:item.border}}
                                                                                      onMouseDown={(e)=>this.mouseDown(e,item.id,1)}
          />
      ):[];

      //反面logo元素
      const logorev = this.state.logo?this.state.logo.map(item =>item.reverse==2 && <img src={item.url} key={item.id} width={item.width} height={item.height}
                                                                                         style={{left:item.left,top:item.top,position:"absolute",border:item.border}}
                                                                                         onMouseDown={(e)=>this.mouseDown(e,item.id,1)}
      />):[];

      const code = this.state.code?this.state.code.map(item =>item.reverse==1 && <img src={item.url} key={item.id} width={item.width} height={item.height}
                                                                                      style={{left:item.left,top:item.top,position:"absolute",border:item.border}}
                                                                                      onMouseDown={(e)=>this.mouseDown(e,item.id,2)}
      />):[];

      const coderev = this.state.code?this.state.code.map(item =>item.reverse==2 && <img src={item.url} key={item.id} width={item.width} height={item.height}
                                                                                         style={{left:item.left,top:item.top,position:"absolute",border:item.border}}
                                                                                         onMouseDown={(e)=>this.mouseDown(e,item.id,2)}
      />):[];

      const text = this.state.text?this.state.text.map(item =>item.reverse==1 && <div key={item.id} width={item.width} height={item.height} color={item.color}
                                                                                      style={{left:item.left,
                                                                                          top:item.top,
                                                                                          position:"absolute",
                                                                                          cursor:"default",
                                                                                          fontSize:item.size,
                                                                                          fontFamily:item.family,
                                                                                          fontStyle:item.style,
                                                                                          border:item.border,
                                                                                          height:item.size,
                                                                                          lineHeight:item.size,
                                                                                          color:item.color,
                                                                                      }}
                                                                                      onMouseDown={(e)=>this.mouseDown(e,item.id,3)}
      >{item.text}</div>):[];

      const textrev = this.state.text?this.state.text.map(item =>item.reverse==2 && <div key={item.id} width={item.width} height={item.height} color={item.color}
                                                                                         style={{left:item.left,
                                                                                             top:item.top,
                                                                                             position:"absolute",
                                                                                             cursor:"default",
                                                                                             fontSize:item.size,
                                                                                             fontFamily:item.family,
                                                                                             fontStyle:item.style,
                                                                                             border:item.border,
                                                                                             height:item.size,
                                                                                             lineHeight:item.size,
                                                                                             color:item.color,
                                                                                         }}
                                                                                         onMouseDown={(e)=>this.mouseDown(e,item.id,3)}
      >{item.text}</div>):[];

      const { sx, sy, sw, sh, display } = this.state.selectable;

      const cardLogoSet = {
          init:this.state.logo,
          count:this.state.logo.length,
          handleAddLogo:function(index){
              //添加logo
              let logo = this.state.logo;

              //添加数据
              logo.push({
                  id:index,
                  url:"http://www.aliyin.com/Upload/Design/Logos/Originals/201803/201803261020032599.png",
                  width:52,
                  height:52,
                  left:"10px",
                  top:"10px",
                  border:"none",
                  reverse:this.state.toggle,
              });

              this.setState({
                  logoid:index,
                  logo:logo,
              })

          }.bind(this),
          handleResizeLogo:function(index, size){

              //设置图片大小
              let logo = this.state.logo,
                  siblingslogo = logo.filter(item => item.id != index),
                  currentlogo = logo.filter(item => item.id == index)[0];

              if(/\d+/.test(currentlogo.id)){
                  let height = currentlogo.height | 1,
                      scale = currentlogo.width / height | 1;
                  currentlogo.width = size;
                  currentlogo.height = size / scale;

                  siblingslogo.push(currentlogo);

                  this.setState({
                      logo:siblingslogo,
                  })
              }
          }.bind(this),
          handleDelLogo:function(index){
              //删除logo
              let logo = this.state.logo;

              //添加数据
              logo = logo.filter(item => item.id != index);

              this.setState({
                  logo:logo,
              })
          }.bind(this),
          handleSetUrl:function(index,url){
              //设置图片大小
              let logo = this.state.logo,
                  siblingslogo = logo.filter(item => item.id != index),
                  currentlogo = logo.filter(item => item.id == index)[0];

              if(/\d+/.test(currentlogo.id)){
                  //设置当前节点的url
                  currentlogo.url = url;
                  //合并兄弟节点
                  siblingslogo.push(currentlogo);

                  this.setState({
                      logo:siblingslogo,
                  })
              }
          }.bind(this),

      }

      const cardCodeSet = {
          init:this.state.code,
          count:this.state.code.length,
          handleAddLogo:function(index){
              //添加logo
              let code = this.state.code;

              //添加数据
              code.push({
                  id:index,
                  url:"../../../image/code.png",
                  width:94,
                  height:94,
                  left:"296px",
                  top:"139px",
                  border:"none",
                  reverse:this.state.toggle,
              });

              this.setState({
                  codeid:index,
                  code:code,
              })
          }.bind(this),
          handleResizeLogo:function(index, size){

              //设置图片大小
              let code = this.state.code,
                  siblingscode = code.filter(item => item.id != index),
                  currentcode = code.filter(item => item.id == index)[0];

              if(/\d+/.test(currentcode.id)){
                  let height = currentcode.height | 1,
                      scale = currentcode.width / height | 1;
                  currentcode.width = size;
                  currentcode.height = size / scale;

                  siblingscode.push(currentcode);

                  this.setState({
                      code:siblingscode,
                  })
              }
          }.bind(this),
          handleDelLogo:function(index){
              //删除logo
              let code = this.state.code;

              //添加数据
              code = code.filter(item => item.id != index);

              this.setState({
                  code:code,
              })
          }.bind(this),
      }

      const cardTextSet = {
          init:this.state.text,
          handleAddText:function(index){
              //添加文字
              let text = this.state.text;

              //添加数据
              text.push({
                  id:index,
                  text:"请输入文字",
                  size:"16px",
                  family:"楷体",
                  style:"normal",
                  color:"black",
                  left:"10px",
                  top:"10px",
                  border:"none",
                  column:"normal",
                  reverse:this.state.toggle,
              });

              this.setState({
                  textid:index,
                  text:text,
              })
          }.bind(this),
          handleResetText:function(index, family, value, size, style, focus){

              //设置图片大小
              let text = this.state.text,
                  siblingstext = text.filter(item => item.id != index),
                  currenttext = text.filter(item => item.id == index)[0];

              if(/\d+/.test(currenttext.id)){

                  currenttext.size = size;
                  currenttext.family = family;
                  currenttext.text = value;
                  currenttext.style = style;
                  currenttext.focus = focus;

                  siblingstext.push(currenttext);

                  this.setState({
                      text:siblingstext,
                  })
              }
          }.bind(this),
          handleDelText:function(index){
              //删除logo
              let text = this.state.text;

              //添加数据
              text = text.filter(item => item.id != index);

              this.setState({
                  text:text,
              })
          }.bind(this),
          handleUpdateText:function(index){

              var text = this.state.text;

              text = text.filter(function(item){

                  if(item.id == index){
                      item.focus = 1;
                  }else{
                      item.focus = 0;
                  }
                  return item;
              });

              this.setState({
                  text:text,
              })

              //设置边框(1.logo 2.code 3.text)
              uiActive(index,3,this);

          }.bind(this),
          handleColorPicker:function(id){

              this.setState({
                  pickerId:id,
                  pickerShow:"block",
              })
          }.bind(this),
      }

      //前景和背景图片上传
      let _this = this;
      const props = {
          name: 'file',
          action: api.upload,
          showUploadList:false,
          onChange(info) {

              if (info.file.status !== 'uploading') {
                  console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                  // message.success(`${info.file.name} file uploaded successfully`);
                  if(info.fileList[0]['response']){
                      let path = info.fileList[0].response.path;
                      if(_this.state.toggle==1){
                          _this.setState({
                              frontimage:path,
                          })
                      }else{
                          _this.setState({
                              backimage:path,
                          })
                      }
                  }
              } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
              }
          }
      };

      //颜色选择器
      const propsPicker = {
          id:this.state.pickerId,
          show:this.state.pickerShow,
          handleOk:function(id,color){

              //设置文字颜色
              let text = _this.state.text,
                  siblingstext = text.filter(item => item.id != id),
                  currenttext = text.filter(item => item.id == id)[0];

              if(/\d+/.test(currenttext.id)){

                  currenttext.color = color;

                  siblingstext.push(currenttext);

                  _this.setState({
                      text:siblingstext,
                  })
              }

          },
          handleClose:function(){

              _this.setState({
                  pickerShow:"none",
              })
          }
      }

    return (
        <div>
            <Row gutter={24}>
                <Col xl={14} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                    <Card title="卡片预览" bordered={false}>
                        <div className={styles.prePanel}>
                            <div className={this.state.toggle==1?styles.preCardPanel + " " + styles.prePanelActive:styles.preCardPanel}
                                 onMouseDown={(e)=>uiselectablehelper(e,this,1)}
                                 style={{background:this.state.frontimage==""?"white":"url("+this.state.frontimage+") no-repeat"}}
                            >
                                {logo}
                                {code}
                                {text}
                            </div>

                            <div className={this.state.toggle==2?styles.preCardPanel + " " + styles.prePanelActive:styles.preCardPanel}
                                 onMouseDown={(e)=>uiselectablehelper(e,this,2)}
                                 style={{background:this.state.backimage==""?"white":"url("+this.state.backimage+") no-repeat"}}
                            >
                                {logorev}
                                {coderev}
                                {textrev}
                            </div>

                            <div className={styles.uiSelectable} style={{left:sx+"px",top:sy+"px",width:sw+"px",height:sh+"px",display:display}}>

                            </div>
                        </div>
                        <div style={{marginTop:"20px",marginLeft:"10px"}}>
                            提示：使用设置对齐功能前，需要用鼠标拖拽的方式选中2个以上的控件，功能才能生效。
                        </div>
                    </Card>
                </Col>

                <Col xl={10} lg={24} md={24} sm={24} xs={24}>
                    <Card title="对齐与分布设置" bordered={false}>
                        <div className={styles.setPanel}>
                            <div>
                                <dl>
                                    <dd><a href="javascript:;"  className={styles.alignleft} title="左对齐" onClick={()=>alignLeft(this)}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.alignright} title="右对齐" onClick={()=>alignRight(this)}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.aligntop} title="顶对齐" onClick={()=>alignTop(this)}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.alignbottom} title="底对齐" onClick={()=>alignBottom(this)}></a></dd>
                                </dl>
                                <dl>
                                    <dd><a href="javascript:;"  className={styles.aligncenter} title="水平居中" onClick={()=>alignCenter(this)}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.alignmiddle} title="垂直居中" onClick={()=>alignMiddle(this)}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.alignhori} title="水平分布" style={{display:"none"}}></a></dd>
                                    <dd><a href="javascript:;"  className={styles.alignvert} title="垂直分布" style={{display:"none"}}></a></dd>
                                </dl>
                            </div>

                            <div>
                                <ul >
                                    <li id="page-title-1" className={this.state.toggle==1?styles.select:""} onClick={()=>reverse(this)} >
                                        <a href="javascript:;">正面</a>
                                    </li>
                                    <li id="page-title-2"  className={this.state.toggle==2?styles.select:""} onClick={()=>reverse(this)}>
                                        <a href="javascript:;">反面</a>
                                    </li>

                                    <li style={{float: "right", background: "rgb(255, 216, 0)"}}><a href="javascript:;" onClick={()=>this.initCard()}>初始化模板</a></li>
                                </ul>
                            </div>

                            <div>
                                <div className={styles.pageItem} style={this.state.toggle==1?{display:"block"}:{display:"none"}}>
                                    <div className={styles.uploadBg}>
                                        <Upload {...props}><div >上传正面背景</div></Upload>
                                    </div>
                                    <CardLogo {...cardLogoSet} reverse="1"></CardLogo>
                                    <CardCode {...cardCodeSet} reverse="1"></CardCode>
                                    <CardText {...cardTextSet} reverse="1"></CardText>
                                </div>
                                <div className={styles.pageItem} style={this.state.toggle==2?{display:"block"}:{display:"none"}}>
                                    <div className={styles.uploadBg}>
                                        <Upload {...props}><div >上传反面背景</div></Upload>
                                    </div>
                                    <CardText {...cardTextSet} reverse="2"></CardText>
                                </div>
                            </div>

                            <div>
                                <div className={styles.cardsetSubmit} onClick={() => this.saveTemplate()}>保存模板</div>
                            </div>

                        </div>
                    </Card>
                </Col>
            </Row>

            <ColorPicker {...propsPicker}></ColorPicker>
        </div>
    );
  }
}
