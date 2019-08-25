import React, { PureComponent, Fragment  } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Tabs, Button, message, Input, Popconfirm  } from 'antd';
import { RlsCertDetail, RlsWatermark } from '../../../components/RlsDetail/index';
import StandardTable  from 'components/StandardTable';
import styles from './RlsCert.less';
import {api} from '../../../utils/config';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;


@connect(({ rlscert, loading }) => ({
  rlscert,
  loading: loading.models.rlscert,
}))
@Form.create()
export default class RlsCert extends PureComponent {
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
        modalVisible:false,
        initTree:[],
        initList:[],
        defaults:{},
        originimage:"",
    };


    componentWillMount(){

        const { dispatch } = this.props;
        //首次加载判断是否有已保存的草稿
        let data_str = window.localStorage.getItem("cert");

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
            type:"rlscert/query",
        })

        dispatch({
            type:"rlscert/queryList",
        })
    }

    componentWillReceiveProps(nextProps){

        const { rlscert: { list, modalVisible, initTree, initList } } = nextProps;
        this.setState({
            list:list,
            modalVisible:modalVisible,
            initTree:initTree,
            initList:initList,
        })

    }

    callback(key) {
        console.log(key);
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
            type: 'rlscert/query',
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
            type: 'rlscert/remove',
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

        const { previewVisible, previewImage, fileList, data, list, showDetail, currentItem, defaultTab, selectedRows, modalVisible, initTree, initList, originimage  } = this.state;
        const { dispatch, loading } = this.props;
        const _this = this;

        const modalProps = {
            curritem:currentItem,
            audit:false,
            dispatch:dispatch,
            onCancel:function(){
                _this.setState({
                    showDetail:1,
                    defaultTab:"2",
                })
            }
        }

        const watermarkProps = {
            modalVisible:modalVisible,
            dispatch:dispatch,
            initTree:initTree,
            initList:initList,
            handleModalVisible:function() {

                dispatch({
                    type: 'rlscert/showModal',
                })
            },
            onCancel:function() {
                dispatch({
                    type: 'rlscert/hideModal',
                })
            },
            handleGetDefaults:function(img,defaults){

                _this.setState({
                    originimage:img,
                    defaults:defaults,
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
            this.setState({
                data:data,
            })
        }
        /**
         * base64转blob
         * @param dataURI
         * @param type
         * @returns {Blob|*}
         */
        const getBlobBydataURI = (dataURI,type) => {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type:type });
        }

        const submit = () =>{

            //生成水印
            const { originimage, defaults, data } = this.state;

            //绘制全部水印
            defaults['showall'] = true;
            document.getElementById("watermarksubmit").src=originimage;
            //绘制水印


            var pro = new Promise(function(resolve,reject){

                var ele = document.getElementById('watermarksubmit');
                new watermark(ele,defaults,resolve);
            })

            pro.then(function(){
                var $Blob= getBlobBydataURI(document.getElementById("watermarksubmit").src);
                var formData = new FormData();
                formData.append("file", $Blob ,"file_"+Date.parse(new Date())+".jpg");

                //组建XMLHttpRequest 上传文件
                var request2 = new XMLHttpRequest();
                //上传连接地址
                request2.open("POST",api.uploadimage);
                request2.onreadystatechange=function()
                {
                    if (request2.readyState==4)
                    {
                        if(request2.status==200){
                            let response = JSON.parse(request2.response);
                            if(response.success){
                                //上传成功
                                console.log(data);
                                dispatch({
                                    type:"rlscert/create",
                                    payload:{
                                        url_org:originimage,
                                        url_wm:response.path,
                                        title:data['content'],
                                    },
                                })
                            }
                            console.log(request2.response.path);


                        }else{
                            console.log("上传失败,检查上传地址是否正确");
                        }
                    }
                }
                request2.send(formData);

            })
        }

        const setStorage = () =>{

            let data_str = JSON.stringify(data);
            window.localStorage.setItem("cert",data_str);
            message.info("已保存到草稿箱");
        }

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                width:80,
            },
            {
                title: '证件标题',
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

        return (
            <div>
                { showDetail==1 && <Card  bordered={false}>
                    <Tabs defaultActiveKey={defaultTab} onChange={this.callback}>
                        <TabPane tab="新申请" key="1">
                            <Card
                                type="inner"
                                title="证件添加水印"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <RlsWatermark {...watermarkProps}></RlsWatermark>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                type="inner"
                                title="发布证件"
                            >
                                <Row>
                                    <Col>
                                        <div className={styles.start+" "+styles.textarea}>
                                            <label>说明内容</label>
                                            <TextArea placeholder="请输入说明内容" style={{width:"100%"}}  rows={4}
                                                      onChange={(e)=>handleTextChange(e,"content")}
                                                      defaultValue={this.state.data.info}
                                            />
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

                {showDetail==2 && <RlsCertDetail { ...modalProps }></RlsCertDetail>}

                <img src={originimage} id="watermarksubmit" style={{display:"none"}}/>
            </div>
        );
    }
}
