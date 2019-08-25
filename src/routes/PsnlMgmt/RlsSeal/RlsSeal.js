import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Tabs, Button, Upload, message, Icon, Select, Modal, Input, Popconfirm, DatePicker  } from 'antd';
import { RlsSealDetail } from '../../../components/RlsDetail/index';
import StandardTable  from 'components/StandardTable';
import styles from './RlsSeal.less';
import {api} from '../../../utils/config';

const { RangePicker } = DatePicker;

const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;

@connect(({ rlsseal, loading }) => ({
  rlsseal,
  loading: loading.models.rlsseal,
}))
@Form.create()
export default class RlsSeal extends PureComponent {
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
        seallist:[],
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
                    title:"",
                    content:"",
                    attachment:[],
                }
            })
        }

        dispatch({
            type:"rlsseal/query",
        })

        dispatch({
            type:"rlsseal/queryseal",
        })
    }

    componentWillReceiveProps(nextProps){

        const { rlsseal: { list, seallist } } = nextProps;
        this.setState({
            list:list,
            seallist:seallist,
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
            type: 'rlsseal/query',
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
            type: 'rlsseal/remove',
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

        const { previewVisible, previewImage, fileList, data, list, seallist, showDetail, currentItem, defaultTab, selectedRows  } = this.state;
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

        const handleTextChange = (value,flag) => {

            data[flag] = value.target.value;
            this.setState({
                data:data,
            })
        }

        const handleRangeChange = (dates,dateStrings) => {

            data["vtime_begin"] = dateStrings[0];
            data["vtime_end"] = dateStrings[1];
            this.setState({
                data:data,
            })
        }

        const handleSelectChange = (value) => {

            data["seal"] = value;
            this.setState({
                data:data,
            })
        }

        const submit = () =>{

            dispatch({
                type:"rlsseal/create",
                payload:data,
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
                title: '文件标题',
                dataIndex: 'title',
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

        const sealoption = seallist.map((item, index) => {

            return <Option value={item.id} key={item.id}>{item.value}</Option>
        });

        return (
            <div>
                { showDetail==1 && <Card  bordered={false}>
                    <Tabs defaultActiveKey={defaultTab} onChange={this.callback}>
                        <TabPane tab="新申请" key="1">
                            <Card
                                type="inner"
                                title="文件标题"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>文件标题</label>
                                            <Input style={{width:"100%",maxWidth:300}} placeholder="请输入文件标题" onChange={(e)=>handleTextChange(e,"title")} defaultValue={this.state.data.class}/>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                type="inner"
                                title="文件内容"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>文件内容</label>
                                            <TextArea placeholder="请输入文件内容" style={{width:"100%"}}  rows={4}
                                                      onChange={(e)=>handleTextChange(e,"content")}
                                                      defaultValue={this.state.data.info}
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
                                            <label>有效时间</label>
                                            <div  style={{width:"100%"}}>
                                                <RangePicker onChange={handleRangeChange} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>选择印章</label>
                                            <div  style={{width:"100%"}}>
                                                <Select style={{ width: 200 }} onChange={handleSelectChange}>
                                                    {sealoption}
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

                {showDetail==2 && <RlsSealDetail { ...modalProps }></RlsSealDetail>}
            </div>
        );
    }
}
