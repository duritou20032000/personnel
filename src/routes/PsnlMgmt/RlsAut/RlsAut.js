import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Tabs, Button, Upload, message, Icon, Select, Modal, Input, Popconfirm  } from 'antd';
import { RlsAutDetail } from '../../../components/RlsDetail/index';
import StandardTable  from 'components/StandardTable';
import AutCode from './AutCode';
import styles from './RlsAut.less';
import {api} from '../../../utils/config';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;

@connect(({ rlsaut, loading }) => ({
  rlsaut,
  loading: loading.models.rlsaut,
}))
@Form.create()
export default class RlsAut extends PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        data:{},
        page:1,
        pageSize:10,
        list:{},
        //showDetail：1.输入页面 2.详情页面 3.扫码确认
        showDetail:1,
        currentItem:{},
        defaultTab:"1",
        selectedRows: [],
        selectedRowKeys:[],
        codeurl:"",
        autid:0,
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
            this.setState({
                data:{
                    class:"",
                    info:"",
                    oinfo:"",
                    type:1,
                    attachment:[],
                }
            })
        }

        dispatch({
            type:"rlsaut/query",
        })
    }

    componentWillReceiveProps(nextProps){

        const { rlsaut: { list } } = nextProps;
        this.setState({
            list:list,
        })
    }

    callback(key) {
        console.log(key);
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
            type: 'rlsaut/query',
            payload: param,
        });
    }

    handleModalVisible = (flag,record) => {

        this.setState({
            showDetail:flag,
            currentItem:record,
        })
    }

    handleMultiDelete = () => {

        //批量删除
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;

        if (!selectedRowKeys) return;

        dispatch({
            type: 'rlsaut/remove',
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

    render() {

        const { previewVisible, previewImage, fileList, data, list, showDetail, currentItem, defaultTab, selectedRows, codeurl, autid  } = this.state;
        const { dispatch, loading } = this.props;
        const _this = this;

        const modalProps = {
            curritem:currentItem,
            audit:false,
            onCancel:function(){
                _this.setState({
                    showDetail:1,
                    defaultTab:"2",
                })
            }
        }

        const autcodeProps = {
            dispatch:dispatch,
            codeurl:codeurl,
            autid:autid,
            handleScan:function(){
                _this.setState({
                    showDetail:1,
                })
            }
        }

        const handleTextChange = (value,flag) => {

            data[flag] = value.target.value;
            this.setState({
                data:data,
            })
        }

        const handleSelectChange = (value) => {

            data["ctype"] = value;
            this.setState({
                data:data,
            })
        }

        const submit = () =>{

            dispatch({
                type:"rlsaut/create",
                payload:data,
                callback: (codeurl,id) => {

                    console.log(codeurl);
                    _this.setState({
                        showDetail:3,
                        codeurl:codeurl,
                        autid:id,
                    })
                }
            })
        }

        const setStorage = () =>{

            let data_str = JSON.stringify(data);
            window.localStorage.setItem("aut",data_str);
            message.info("已保存到草稿箱");
        }

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传证件</div>
            </div>
        );

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                width:80,
            },
            {
                title: '类别',
                dataIndex: 'class',
                width:200,
            },
            {
                title: '报告',
                render: (text,record) => (
                    <Fragment>
                        <a href="javascript:;" onClick={() => this.handleModalVisible(2,record)}>查看</a>
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
                { showDetail==1 && <Card  bordered={false}>
                    <Tabs defaultActiveKey={defaultTab} onChange={this.callback}>
                        <TabPane tab="新申请" key="1">
                            <Card
                                type="inner"
                                title="类别"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>类别</label>
                                            <Input style={{width:"100%",maxWidth:300}} placeholder="请输入待查询的类别, 如 注册会计师" onChange={(e)=>handleTextChange(e,"class")} defaultValue={this.state.data.class}/>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                type="inner"
                                title="相关信息"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>您的信息</label>
                                            <TextArea placeholder="请输入您的相关信息, 如考试编号, 身份证号 等, 我们将后台为您人工查询." style={{width:"100%"}}  rows={4}
                                                      onChange={(e)=>handleTextChange(e,"info")}
                                                      defaultValue={this.state.data.info}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>机构信息</label>
                                            <TextArea placeholder="请输入查询机构的信息, 如网址, 电话等" style={{width:"100%"}}  rows={4}
                                                      onChange={(e)=>handleTextChange(e,"oinfo")}
                                                      defaultValue={this.state.data.oinfo}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>上传证件</label>
                                            <div  style={{width:"100%"}}>
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
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>选择类型</label>
                                            <div  style={{width:"100%"}}>
                                                <Select style={{ width: 200 }} onChange={handleSelectChange}>
                                                    <Option value="1">成绩查询</Option>
                                                    <Option value="2">证书认证</Option>
                                                    <Option value="3">身份认证</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className={styles.center + " " + styles.btn}>
                                            <Button type="default" style={{marginRight:80}} onClick={setStorage}>保存草稿</Button>
                                            <Button type="default" onClick={submit}>下一步</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                        </TabPane>
                        <TabPane tab="历史" key="2">
                            <div className={styles.tableListOperator}>
                                {
                                    selectedRows.length > 0 && (
                                        <Popconfirm title={'你确定要删除这些项目吗?'} placement="right" onConfirm={this.handleMultiDelete}>
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

            {showDetail==2 && <RlsAutDetail { ...modalProps }></RlsAutDetail>}

                {showDetail==3 && <AutCode {...autcodeProps}/>}
            </div>
        );
    }
}
