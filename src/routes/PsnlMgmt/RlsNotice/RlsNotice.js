import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Tabs, Button, Upload, message, Icon, Select, Modal, Input, Popconfirm, DatePicker  } from 'antd';
import { RlsNoticeDetail } from '../../../components/RlsDetail/index';
import PicturesWall from '../../../components/PicturesWall/index';
import StandardTable  from 'components/StandardTable';
import styles from './RlsNotice.less';
import {api} from '../../../utils/config';
import EditModel from '../../../components/EditModel/EditModel.js';

const { RangePicker } = DatePicker;

const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ rlsnotice, loading }) => ({
  rlsnotice,
  loading: loading.models.rlsnotice,
}))
@Form.create()
export default class RlsNotice extends PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        data:{},
        page:1,
        pageSize:10,
        list:{},
        showDetail:1,
        currentItem:{},
        defaultTab:"1",
        selectedRows: [],
        selectedRowKeys:[],
        preview:false,
        clear:false,
        version:1,
        datediff:0,
    };


    componentWillMount(){

        const { dispatch } = this.props;
        //首次加载判断是否有已保存的草稿
        let data_str = window.localStorage.getItem("aut");

        if(data_str){
            let data = JSON.parse(data_str);
            this.setState({
                data:data,
            })

        }else{

            this.initDate(this);
        }

        dispatch({
            type:"rlsnotice/query",
        })

        if(window.location.hash=="#/rlsnotice/history"){

            this.setState({
                defaultTab:"2",
            })
        }else{

            this.setState({
                defaultTab:"1",
            })
        }

    }

    componentWillReceiveProps(nextProps){

        const { rlsnotice: { list } } = nextProps;
        this.setState({
            list:list,
        })
    }

    callback(key) {
        console.log(key);
    }

    initDate = (_this) =>{

        _this.setState({
            data:{
                title:"",
                content:"",
                vtime_begin:"",
                vtime_end:"",
                type:1,
                attachment:[],
                fileList:[],
            },
            version:Math.random(),
        })
    }

    resetField = () =>{

        this.setState({
            data:{
                title:"",
                content:"",
                vtime_begin:"",
                vtime_end:"",
                type:1,
                attachment:[],
                fileList:[],
            },
            fileList:[],
            version:Math.random(),
        })
        document.getElementById("noticeid").value="";
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;

        form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);
            if(!err){

                let data = this.state.data;
                data["title"] = values["title"];
                data["content"] = values["content"];

                if(!data["content"]){
                    message.error("请填写内容");
                    return;
                }

                var record = {
                    att:data.attachment,
                    title:data.title,
                    content:data.content,
                    vtime:data['vtime_begin']+"~"+data['vtime_end']
                }

                this.setState({
                    data:data,
                    showDetail:2,
                    currentItem:record,
                    preview:true,
                })

            }

        });


    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {

        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList, file, event }) => {

        if(file.status=="done"){
            //当前文件已经上传完成
            if(fileList.length>0){
                let url = fileList[0]['response']['path'];
                let path = [];
                for(let index in fileList){

                    if(fileList[index]["status"]!="done"){
                        //如果有文件没有上传完毕，返回。
                        return;
                    }
                    path[index] =  fileList[index]['response']['path'];
                }

                let data = this.state.data;
                data["attachment"] = path;

                this.setState({
                    data:data,
                })

            }
        }

        fileList = fileList.filter((file) => {
            if (file.response) {
                return file;
            }
            return true;
        });

        this.setState({ fileList });
    }

    handleTableChange = (pagination, filters, sorter) => {

        const { dispatch } = this.props;

        this.setState({
            page: pagination.current,
            pageSize:pagination.pageSize,
        });

        let pager = {
            page:pagination.current,
            pageSize:pagination.pageSize,
        }

        let param = {...pager,...filters};

        dispatch({
            type: 'rlsnotice/query',
            payload: param,
        });
    }

    handleModalVisible = (flag,record) => {

        this.setState({
            showDetail:flag,
            preview:false,
            currentItem:record,
        })
    }

    handleMultiDelete = () => {

        //批量删除
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;

        if (!selectedRowKeys) return;

        dispatch({
            type: 'rlsnotice/remove',
            payload: {
                ids: selectedRowKeys,
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                    selectedRowKeys: [],
                });
            },
        });

    }

    handleSelectRows = (rows,keys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: keys,
        });
    }

    onChange = (content) =>{

        let data = this.state.data;

        data['content'] = content;
        this.setState({
            data:data
        })
    }

    onRef = (ref) => {
        this.child = ref
    }

    render() {

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };

        const { previewVisible, previewImage, fileList, data, list, showDetail, currentItem, defaultTab, selectedRows, preview, clear, expandInput, datediff } = this.state;
        const { dispatch, loading } = this.props;
        const { getFieldDecorator } = this.props.form;

        const _this = this;

        const modalProps = {
            curritem:currentItem,
            audit:false,
            preview:preview,
            onCancel:function(){
                _this.setState({
                    showDetail:1,
                    defaultTab:"2",
                    data:{
                        title:"",
                        content:"",
                        vtime_begin:"",
                        vtime_end:"",
                        attachment:[],
                    },
                    datediff:"",

                })

            },
            onEdit:function(){
                _this.setState({
                    showDetail:1,
                    defaultTab:"1",
                })
            },
            submit:function() {

                dispatch({
                    type:"rlsnotice/create",
                    payload:_this.state.data,
                    callback: (curritem) => {

                        _this.setState({
                            currentItem:curritem,
                            preview:false,
                            loading:false,
                        })

                        _this.child.handleReset();

                        _this.setState({
                            fileList:[],
                        })
                        _this.props.form.resetFields();

                        document.getElementById("opentab").href=curritem.view;
                        document.getElementById("opentab").click();
                    },
                })
            }
        }

        const handleTextChange = (value,flag) => {

            data[flag] = value.target.value;
            this.setState({
                data:data,
            })
        }

        const handleSelectChange = (dates,dateStrings) => {

            data["vtime_begin"] = dateStrings[0];
            data["vtime_end"] = dateStrings[1];
            let datediff = datedifference(dateStrings[0],dateStrings[1]) || 0;

            this.setState({
                data:data,
                datediff:datediff
            })

        }

        const datedifference = (sDate1, sDate2) => {

            var dateSpan,
                tempDate,
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        };

        const setStorage = () =>{

            let data_str = JSON.stringify(data);
            window.localStorage.setItem("aut",data_str);
            message.info("已保存到草稿箱");
        }

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                width:80,
            },
            {
                title: '公告标题',
                dataIndex: 'title',
                width:200,
            },
            {
                title: '报告',
                render: (text,record) => (
                    <Fragment>
                        {/*<a href="javascript:;" onClick={() => this.handleModalVisible(2,record)}>查看</a>*/}
                        <a href={record.view} target="_blank" >查看</a>
                    </Fragment>
                ),
                width:100,
            },
            {
                title: '有效时间',
                dataIndex: 'vtime',
                width:200,
            },
            {
                title: '电子签名',
                dataIndex: 'sign',
                width:200,
                render:val => <span className={styles.cellnowrap}>{val}</span>,
            },
            {
                title: '审核状态',
                dataIndex: 'pass',
                render:val => <span style={{color:val!=2?val==1?"green":"black":"red"}}>{val!=2?val==1?"通过":"待审核":"未通过"}</span>,
                width:100,
            },
            {
                title: '创建时间',
                dataIndex: 'create',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
                width:200,
            }
        ];

        return (
            <div>
                {!clear && <Card  bordered={false} className={showDetail==1?"":styles.hidediv}>
                    <Tabs defaultActiveKey={defaultTab} onChange={this.callback}>
                        <TabPane tab="新申请" key="1">
                            <Form onSubmit={this.handleSubmit} className="login-form">

                                <Card
                                    type="inner"
                                    title="公告标题"
                                >
                                    <Row>
                                        <Col>
                                            <FormItem
                                                {...formItemLayout}
                                                label="公告标题"
                                            >
                                                {getFieldDecorator('title', {
                                                    initalValue:data.title,
                                                    rules: [{ required: true, message: '请输入公告标题!' }],
                                                })(
                                                    <Input style={{width:"100%"}} placeholder="请输入公告标题" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card
                                    type="inner"
                                    title="公告内容"
                                >
                                    <Row>
                                        <Col>
                                             <FormItem
                                                 {...formItemLayout}
                                                 label="公告标题"
                                             >
                                                 {getFieldDecorator('content', {
                                                     initalValue:data.content,
                                                     rules: [{ required: true, message: '请填写公告内容!' }],
                                                 })(
                                                     <EditModel
                                                         onRef={this.onRef}
                                                         placeholder="在此处填写公告内容"
                                                     ></EditModel>
                                                 )}
                                             </FormItem>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <FormItem
                                                {...formItemLayout}
                                                label="上传图片"
                                            >

                                                {getFieldDecorator('fileList', {
                                                    rules: [],
                                                })(
                                                    <div>
                                                       <Upload
                                                           name='file'
                                                           action={api.upload}
                                                           listType="picture-card"
                                                           fileList={fileList}
                                                           onPreview={this.handlePreview}
                                                           onChange={this.handleChange}
                                                       >
                                                           {fileList.length >= 3 ? null : uploadButton}
                                                       </Upload>
                                                       <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                           <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                                       </Modal>
                                                    </div>
                                                )}
                                            </FormItem>

                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>

                                            <FormItem
                                                {...formItemLayout}
                                                label="有效时间"
                                            >
                                                {getFieldDecorator('noticepick', {
                                                    rules: [{ required: true, message: '请填选择有效时间!' }],
                                                })(
                                                    <RangePicker onChange={handleSelectChange} />
                                                )}
                                            </FormItem>
                                            {datediff!=0 && (<div style={{position:"absolute",top:"0px",right:"50px"}}>已选择：{datediff}天</div>)}
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <div className={styles.center + " " + styles.btn}>
                                                <FormItem>
                                                    <Button type="default" style={{marginRight:80}} onClick={setStorage}>保存草稿</Button>
                                                    {/*<Button type="default" onClick={submit}  htmlType="submit">下一步</Button>*/}
                                                    <Button type="default" htmlType="submit">下一步</Button>
                                                    <a id="opentab" href="" target="_blank"></a>
                                                </FormItem>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </TabPane>
                        <TabPane tab="历史" key="2">
                            <div className={styles.tableListOperator}>
                                {
                                    selectedRows.length > 0 && (
                                        <Popconfirm title={'你确定要删这除些项目吗?'} placement="right" onConfirm={this.handleMultiDelete}>
                                            <span><Button style={{ marginLeft: 8, marginBottom:10 }}>批量删除</Button></span>
                                        </Popconfirm>
                                    )
                                }
                            </div>
                            <StandardTable
                                selectedRows={selectedRows}
                                loading={loading}
                                data={list}
                                columns={columns}
                                scroll={{ x: 900}}
                                onChange={this.handleTableChange}
                                onSelectRow={this.handleSelectRows}
                            />
                        </TabPane>
                    </Tabs>
              </Card>}

                {showDetail==2 && <RlsNoticeDetail { ...modalProps }></RlsNoticeDetail>}
            </div>
        );
    }
}
