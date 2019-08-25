import React, { Component, Fragment } from 'react';
import { Row, Col, Input, Select, Icon, Upload, message, Button } from 'antd';
import { ColorPicker } from 'components/CardSet';
import styles from './index.less';
import {api} from '../../utils/config';
const { TextArea } = Input;
const Option = Select.Option;


export default class QrCodeSet extends Component {
    state = {
        color:["#ffffff","#000000","#000000","#000000"],
        size:250,
        radio:1,
        level:"L",
        logo:"",
        text:"test",
        pickerShow:"none",
        pickerId:0,
        textstyle:"block",
    };

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps){

        let { textstyle, data } = nextProps;

        if(data && JSON.stringify(data)!="{}" && data.init){
            let color = ["#"+data["bg"],"#"+data["fg"],"#"+data["wk"],"#"+data["nk"]];

            this.setState({
                color:color,
                size:data['size'],
                radio:data['radio'],
                level:data['level'],
                logo:data['logo'],
                textstyle:textstyle?textstyle:"block",
            })
        }
    }

    //拼接二维码请求字符串,并返回上一层组件
    getParam (_this, newtext){

        let { color, size, radio, level, logo, text } = _this.state;
        let color_key = ['bg','fg','wk','nk'];
        let textstr = newtext?newtext:text;
        let  paramStr = "text=" + textstr + "&";

        for(var temp in color_key){
            let color_item = color[temp].replace("#","");
            paramStr = paramStr + color_key[temp] + "=" + color_item + "&";
        }

        paramStr = paramStr + "size=" + size + "&";
        paramStr = paramStr + "radio=" + radio + "&";
        paramStr = paramStr + "level=" + level + "&";
        paramStr = paramStr + "logo=" + logo;

        _this.props.onchange(paramStr);
    }

    render() {

        let _this = this;

        const handlePicker = (id) =>{

            this.setState({
                pickerId:id,
                pickerShow:"block",
            })
        }

        const handleTextChange = (e) =>{

            const { value } = e.target;

            this.setState({
                text:value,
            })

            this.getParam (this,value);
        }

        const handleChange = (value,key) => {

            let state = this.state;
            state[key] = value;

            this.getParam (this);
        }

        const props = {
            name: 'file',
            action: api.upload,
            showUploadList:false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let length = info.fileList.length;
                    if(info.fileList[length - 1]['response']) {
                        console.log(info.fileList);
                        let path = info.fileList[length - 1].response.path;
                        _this.setState({
                            logo: path,
                        })

                        _this.getParam (_this);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        //颜色选择器
        const propsPicker = {
            id:this.state.pickerId,
            show:this.state.pickerShow,
            handleOk:function(id,color){

                let colortmp = _this.state.color;
                colortmp[id] = color;

                _this.setState({
                    color:colortmp
                });

                _this.getParam (_this);
            },
            handleClose:function(){

                _this.setState({
                    pickerShow:"none",
                })
            }
        }

        return (
            <Fragment>
                <Row gutter={24} className={styles.cell} style={{display:this.state.textstyle}}>
                    <Col  xl={24} lg={24} md={24} sm={24} xs={24} >
                        推荐150字以内，支持普通文本/网址/EMAIL地址
                    </Col>
                </Row>

                <Row gutter={24} className={styles.cell} style={{display:this.state.textstyle}}>
                    <Col  xl={24} lg={24} md={24} sm={24} xs={24} >
                        <TextArea rows={4} onChange={handleTextChange}/>
                    </Col>
                </Row>

                <Row gutter={24} className={styles.cell}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>图片背景颜色</span>
                                    <Input className={styles.inputStyle} value={this.state.color[0]} readOnly/>
                                    <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.color[0]}} onClick={() => handlePicker(0)}><span></span></div>
                                </div>
                            </Col>

                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>图片颜色</span>
                                    <Input className={styles.inputStyle} value={this.state.color[1]} readOnly/>
                                    <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.color[1]}} onClick={() => handlePicker(1)}><span></span></div>
                                </div>
                            </Col>

                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>外框颜色</span>
                                    <Input className={styles.inputStyle} value={this.state.color[2]} readOnly/>
                                    <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.color[2]}} onClick={() => handlePicker(2)}><span></span></div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={24} >
                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>内框颜色</span>
                                    <Input className={styles.inputStyle} value={this.state.color[3]} readOnly/>
                                    <div id="ColorPickerBox" className={styles.ColorPickerBox} style={{backgroundColor:this.state.color[3]}} onClick={() => handlePicker(3)}><span></span></div>
                                </div>
                            </Col>

                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell} defaultValue={this.state.size}>
                                <div className={styles.center}>
                                    <span>图片大小</span>
                                    <Select value={this.state.size.toString()}  className={styles.inputStyle}  onChange={(value) => handleChange(value,"size")}>
                                        <Option value="25">25px</Option>
                                        <Option value="50">50px</Option>
                                        <Option value="75">75px</Option>
                                        <Option value="100">100px</Option>
                                        <Option value="125">125px</Option>
                                        <Option value="150">150px</Option>
                                        <Option value="175">175px</Option>
                                        <Option value="200">200px</Option>
                                        <Option value="225">225px</Option>
                                        <Option value="250">250px</Option>

                                    </Select>
                                </div>
                            </Col>

                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>纠错等级</span>
                                    <Select value={this.state.level}  className={styles.inputStyle} onChange={(value) => handleChange(value,"level")}>
                                        <Option value="L">最低</Option>
                                        <Option value="M">低</Option>
                                        <Option value="Q">中等</Option>
                                        <Option value="H">高</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>定点样式</span>
                                    <Select value={this.state.radio.toString()}  className={styles.inputStyle}  onChange={(value) => handleChange(value,"radio")}>
                                        <Option value="1">直角</Option>
                                        <Option value="2">液态</Option>
                                        <Option value="0">圆圈</Option>
                                    </Select>
                                </div>
                            </Col>

                            <Col xl={8} lg={24} md={24} sm={24} xs={24} className={styles.panelcell}>
                                <div className={styles.center}>
                                    <span>上传Logo</span>
                                    <Upload {...props}  className={styles.inputStyle} >
                                        <Button>
                                            <Icon type="upload" /> 上传图片
                                        </Button>
                                    </Upload>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <ColorPicker {...propsPicker}></ColorPicker>
            </Fragment>
        );
    }
}
