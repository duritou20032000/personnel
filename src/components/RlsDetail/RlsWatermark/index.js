import React, { PureComponent } from "react";
import { Row, Col, Tabs, Button,  Select, Input, DatePicker  } from 'antd';
import SliderInput from '../SliderInput';
import { ColorPicker } from 'components/CardSet';
import styles from './index.less';
import './watermark.js';
import AcModal from './AcModal'
import config from '../../../utils/config';
import { mouseDown, initDragRect } from "./commen";

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

export default class RlsWatermark extends PureComponent{
    state = {
        defaults:{
            path: 'image/code.png',
            dataPath: false,
            //内容
            text_default: '默认水印测试',           //系统默认内容
            text_defined:'',           //自定义文本
            text_date:'',           //日期
            //文字字符串宽度
            textWidth_default: 13,
            textWidth_defined: 13,
            textWidth_date: 13,
            //字大小
            textSize_default: 20,
            textSize_defined: 18,
            textSize_date: 18,
            //颜色
            textColor_default: 'white',
            textColor_defined: 'white',
            textColor_date: 'white',
            //字背景颜色
            textBg: 'rgba(0, 0, 0, 0.0)',
            //字体
            fontFamily_default: '宋体',
            fontFamily_defined: '宋体',
            fontFamily_date: '宋体',
            default:1,
            //默认平铺水印间距
            space:10,

            //字或者图片在图片中的x,y坐标
            left_default:0,
            top_default:0,
            left_defined:0,
            top_defined:0,
            left_date:0,
            top_date:0,
            left_image:0,
            top_image:0,
            //透明度
            opacity_default: 0.7,
            opacity_defined: 0.7,
            opacity_date: 0.7,
            opacity_image: 0.7,
            imgSize:50,
            radian:0,
            showall:true,
        },
        controls:{
            //拖拽控件位置参数
            left_default:0,
            top_default:0,
            size_defined:0,
            left_defined:0,
            top_defined:0,
            size_date:0,
            left_date:0,
            top_date:0,
            left_image:0,
            top_image:0,
            size_image:0,
        },
        originImage:config.url+ "/image/uploads/20180514/c6c53f69e9c959fcda127b78b5cd4a60.jpg",
        pickerId:'textColor_default',
        pickerShow:"none",
        bigImageShow:"none",
        bigImage:"",
        modalVisible:false,
        random:1,
    }

    componentWillMount(){

        const { dispatch } = this.props;

        dispatch({
            type:"rlscert/fetchNode",
        })
    }

    componentDidMount(){
        this.drawWaterMark();

        this.getScale();
    }

    componentWillReceiveProps(nextProps){

        const { modalVisible, initTree, initList } = nextProps;

        this.setState({
            modalVisible:modalVisible,
            initTree:initTree,
            initList:initList,
        })
    }

    drawWaterMark = () => {

        //初始为原图
        let img = this.state.originImage,
            param = this.state.defaults,
            bigImage = document.getElementById("watermark").src;

        //只绘制默认水印
        param['showall'] = false;

        document.getElementById("watermark").src=img;
        //绘制水印
        var ele = document.getElementById('watermark');
        new watermark(ele,param);

        this.props.handleGetDefaults(img,param);

        initDragRect(this);
    }

    onHandleChange = (value,flag) => {

        let defaults = this.state.defaults;
        defaults[flag] = value;
        this.setState({
            defaults: defaults,
            random:Math.random(),
        });

        this.drawWaterMark();
    }

    onTextChange = (e,flag) => {

        let defaults = this.state.defaults;
        defaults[flag] = e.target.value;
        this.setState({
            defaults: defaults,
            random:Math.random(),
        });

        this.drawWaterMark();
    }

    handlePicker = (id) => {

        this.setState({
            pickerId:id,
            pickerShow:"block",
        })
    }

    //获取面板和实际图像的比例
    getScale = () => {
        var image = new Image();
        image.src = this.state.originImage;
        image.onload = function (){

            var controlWidth = document.getElementById("watermark").width;
            var scale = controlWidth/this.width;
            window.localStorage.setItem("watermarkScale",scale);
        }
    }


    hiddenImage = () =>{

        this.setState({
            bigImageShow:"none"
        })
    }

    showImage = () =>{
        //初始为原图
        let img = this.state.originImage,
            param = this.state.defaults;

        //只绘制默认水印
        param['showall'] = true;

        document.getElementById("watermarkbig").src=img;
        //绘制水印
        var ele = document.getElementById('watermarkbig');
        new watermark(ele,param);

        this.setState({
            bigImageShow:"flex",
            bigImage: document.getElementById('watermarkbig').src,
        })
    }

    handleImageChange = () =>{

        console.log("图片变化")
    }

    render(){

        const { defaults: {
            textSize_default,
            text_defined,
            textSize_defined,
            textColor_defined,
            opacity_defined,
            fontFamily_defined,
            text_date,
            textSize_date,
            textColor_date,
            opacity_date,
            fontFamily_date,
            path,
            opacity_image,
            imgSize,
        },
        controls:{
            //拖拽控件位置参数
            left_defined,
            top_defined,
            size_defined,
            left_date,
            top_date,
            size_date,
            left_image,
            top_image,
            size_image,
        },
            bigImageShow, bigImage, modalVisible, initTree, initList } = this.state;

        const { handleModalVisible, onCancel, dispatch } = this.props;

        let _this = this;

        //颜色选择器
        const propsPicker = {
            id:this.state.pickerId,
            show:this.state.pickerShow,
            handleOk:function(id,color){

                let defaults = _this.state.defaults;
                defaults[id] = color;
                _this.setState({
                    defaults: defaults,
                    random:Math.random(),
                });

                _this.drawWaterMark();
            },
            handleClose:function(){

                _this.setState({
                    pickerShow:"none",
                })
            }
        }

        const handleSelectChange = (dates,dateStrings) => {

            let defaults = this.state.defaults;
            defaults['text_date'] = dateStrings[0] + "~" + dateStrings[1];
            this.setState({
                defaults: defaults,
                random:Math.random(),
            });

            this.drawWaterMark();
        }

        const imgReload = () =>{
            var watermark = document.getElementById("watermark")
            var width = watermark.width,height = watermark.height;
            var control = document.getElementById("control");
            if(control){
                control.style.cssText="width:"+width+"px;height:"+height+"px;position:relative;margin-top:"+(-height)+"px;margin-left:auto;margin-right:auto";
            }
        }

        const modalProps = {
            item:  {},
            roles:[],
            visible: true,
            maskClosable: false,
            title: '图片库',
            wrapClassName: 'vertical-center-modal',
            dispatch:dispatch,
            initTree:initTree,
            initList:initList,
            onOk (data) {
                // dispatch({
                //     type: `account/${modalType}`,
                //     payload: data,
                // })
            },
            onSelectImage (path) {

                _this.setState({
                    originImage:path,
                });

                document.getElementById("watermark").src=path;
                onCancel();
            },
            onCancel () {
                onCancel();
            },
        }

        return (
            <div style={{width:"100%"}}>
                <Row gutter={24}>
                    <Col span={24}>
                        <div className={styles.center}>
                            <img src="http://imgsrc.baidu.com/imgad/pic/item/cb8065380cd79123499f23a0a7345982b3b780e3.jpg"
                                 className={styles.img}
                                 id="watermark"
                                 onLoad={imgReload}
                                 onChange={this.handleImageChange}
                            />
                        </div>
                        <div id="control">
                            <div className={styles.dragRect} id="defined"
                                style={{fontSize:size_defined,lineHeight:size_defined+"px",color:textColor_defined,opacity:opacity_defined,fontFamily:fontFamily_defined,left:left_defined,top:top_defined}}
                                 onMouseDown={(e)=>mouseDown(e,'defined',this)}
                            >{text_defined}</div>
                            <div className={styles.dragRect} id="date"
                                 style={{fontSize:size_date,lineHeight:size_date+"px",color:textColor_date,opacity:opacity_date,fontFamily:fontFamily_date,left:left_date,top:top_date}}
                                 onMouseDown={(e)=>mouseDown(e,'date',this)}
                            >
                                {text_date}
                            </div>
                            <div className={styles.dragRect} id="image"
                                 style={{width:size_image,height:size_image,opacity:opacity_image,background:`url(${path}) no-repeat`,backgroundSize:'cover',left:left_image,top:top_image}}
                                 onMouseDown={(e)=>mouseDown(e,'image',this)}
                            ></div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div style={{padding:"20px 15px"}}>
                            <Button onClick={this.showImage}>预览</Button>
                            <Button style={{marginLeft:20}} onClick={handleModalVisible}>图片库</Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="文本" key="1">
                                <Row gutter={24}>
                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>自定义文本</label>
                                            <Input style={{ width: 120 }} onChange={(e)=>this.onTextChange(e,'text_defined')}/>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>大小</label>
                                            <SliderInput
                                                min={12}
                                                max={120}
                                                value={12}
                                                onHandleChange={(e)=>this.onHandleChange(e,'textSize_defined')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>透明度</label>
                                            <SliderInput
                                                min={0}
                                                max={1}
                                                value={1}
                                                step={0.1}
                                                onHandleChange={(e)=>this.onHandleChange(e,'opacity_defined')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>字体</label>
                                            <Select style={{ width: 120 }} onChange={(e)=>this.onHandleChange(e,'fontFamily_defined')}>
                                                <Option value="仿宋">仿宋</Option>
                                                <Option value="华文仿宋">华文仿宋</Option>
                                                <Option value="华文宋体">华文宋体</Option>
                                                <Option value="华文新魏">华文新魏</Option>
                                                <Option value="华文楷体">华文楷体</Option>
                                                <Option value="华文行楷">华文行楷</Option>
                                                <Option value="华文隶书">华文隶书</Option>
                                                <Option value="微软雅黑">微软雅黑</Option>
                                                <Option value="隶书">隶书</Option>
                                                <Option value="楷体">楷体</Option>
                                                <Option value="黑体">黑体</Option>
                                            </Select>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>颜色</label>
                                            <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.defaults['textColor_defined']}} onClick={() => this.handlePicker('textColor_defined')}><span></span></div>
                                        </div>
                                    </Col>
                                </Row>

                            </TabPane>
                            <TabPane tab="日期" key="2">
                                <Row gutter={24}>
                                    <Col xs={24} sm={10} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>添加日期</label>
                                            <RangePicker style={{ width: 240 }} onChange={handleSelectChange} />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={7} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>大小</label>
                                            <SliderInput
                                                min={12}
                                                max={120}
                                                value={12}
                                                onHandleChange={(e)=>this.onHandleChange(e,'textSize_date')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={7} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>透明度</label>
                                            <SliderInput
                                                min={0}
                                                max={1}
                                                value={1}
                                                step={0.1}
                                                onHandleChange={(e)=>this.onHandleChange(e,'opacity_date')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={7} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>字体</label>
                                            <Select style={{ width: 120 }} onChange={(e)=>this.onHandleChange(e,'fontFamily_date')}>
                                                <Option value="仿宋">仿宋</Option>
                                                <Option value="华文仿宋">华文仿宋</Option>
                                                <Option value="华文宋体">华文宋体</Option>
                                                <Option value="华文新魏">华文新魏</Option>
                                                <Option value="华文楷体">华文楷体</Option>
                                                <Option value="华文行楷">华文行楷</Option>
                                                <Option value="华文隶书">华文隶书</Option>
                                                <Option value="微软雅黑">微软雅黑</Option>
                                                <Option value="隶书">隶书</Option>
                                                <Option value="楷体">楷体</Option>
                                                <Option value="黑体">黑体</Option>
                                            </Select>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={10} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>颜色</label>
                                            <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.defaults['textColor_date']}} onClick={() => this.handlePicker('textColor_date')}><span></span></div>
                                        </div>
                                    </Col>

                                </Row>
                            </TabPane>
                            <TabPane tab="二维码" key="3">
                                <Col xs={24} sm={7} xxl={6}>
                                    <div className={styles.textarea}>
                                        <label>宽度</label>
                                        <SliderInput
                                            min={12}
                                            max={400}
                                            value={12}
                                            onHandleChange={(e)=>this.onHandleChange(e,'imgSize')}
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} sm={7} xxl={6}>
                                    <div className={styles.textarea}>
                                        <label>透明度</label>
                                        <SliderInput
                                            min={0}
                                            max={1}
                                            value={1}
                                            step={0.1}
                                            onHandleChange={(e)=>this.onHandleChange(e,'opacity_image')}
                                        />
                                    </div>
                                </Col>
                            </TabPane>
                            <TabPane tab="系统" key="4">
                                <Row gutter={24}>
                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>大小</label>
                                            <SliderInput
                                                min={12}
                                                max={120}
                                                value={12}
                                                onHandleChange={(e)=>this.onHandleChange(e,'textSize_default')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>透明度</label>
                                            <SliderInput
                                                min={0}
                                                max={1}
                                                value={1}
                                                step={0.1}
                                                onHandleChange={(e)=>this.onHandleChange(e,'opacity_default')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>角度</label>
                                            <SliderInput
                                                min={-90}
                                                max={90}
                                                value={0}
                                                step={1}
                                                onHandleChange={(e)=>this.onHandleChange(e,'radian')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>间距</label>
                                            <SliderInput
                                                min={0}
                                                max={300}
                                                value={1}
                                                step={1}
                                                onHandleChange={(e)=>this.onHandleChange(e,'space')}
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>字体</label>
                                            <Select style={{ width: 120 }} onChange={(e)=>this.onHandleChange(e,'fontFamily_default')}>
                                                <Option value="仿宋">仿宋</Option>
                                                <Option value="华文仿宋">华文仿宋</Option>
                                                <Option value="华文宋体">华文宋体</Option>
                                                <Option value="华文新魏">华文新魏</Option>
                                                <Option value="华文楷体">华文楷体</Option>
                                                <Option value="华文行楷">华文行楷</Option>
                                                <Option value="华文隶书">华文隶书</Option>
                                                <Option value="微软雅黑">微软雅黑</Option>
                                                <Option value="隶书">隶书</Option>
                                                <Option value="楷体">楷体</Option>
                                                <Option value="黑体">黑体</Option>
                                            </Select>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={8} xxl={6}>
                                        <div className={styles.textarea}>
                                            <label>颜色</label>
                                            <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.defaults['textColor_default']}} onClick={() => this.handlePicker('textColor_default')}><span></span></div>
                                        </div>
                                    </Col>

                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

                <ColorPicker {...propsPicker}></ColorPicker>

                <div className={styles.bigImageBg} style={{display:bigImageShow}} onClick={()=>this.hiddenImage()}>
                    <img src={bigImage} id="watermarkbig"/>
                </div>

                { modalVisible && <AcModal {...modalProps}/> }
            </div>
        )
    }
}