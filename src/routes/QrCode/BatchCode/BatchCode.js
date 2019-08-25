import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Tabs, Table, Button, Upload, message, Icon } from 'antd';
import styles from './BatchCode.less';
import QrCodeSet from '../../../components/QrCodeSet/index';
import { api } from '../../../utils/config';


const TabPane = Tabs.TabPane;

@connect(({ batchcode, loading }) => ({
  batchcode,
  loading: loading.models.batchcode,
}))
@Form.create()
export default class BatchCode extends PureComponent {
    state = {
        batchcode:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        batchcode2:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        text:"测试",
        type:4,
        data:{},
        dataexp1:{},
        dataexp2:{},
        export:{
            list:[],
            param:{},
            param2:{},
        }
    };

    componentWillMount(){

        const { dispatch } = this.props;

        dispatch({
            type: 'batchcode/fetch',
            payload:{
                type:this.state.type,
            }
        });
    }

    componentWillReceiveProps(nextProps){

        let { batchcode:{ data, data2 } } = nextProps;

        if(this.state.type == 3){
            //更新母码信息,同时初始化母码设置面板值
            data['init'] = true;

            this.setState({
                batchcode:this.concatstr(data),
                batchcode2:this.concatstr(data2),
                data:data,
                dataexp1:data,
                dataexp2:data2,
            })
        }else{
            //更新子码信息,同时初始化子码设置面板值
            data2['init'] = true;

            this.setState({
                batchcode:this.concatstr(data),
                batchcode2:this.concatstr(data2),
                data:data2,
                dataexp1:data,
                dataexp2:data2,
            })
        }

    }

    //拼接信息
    concatstr = (data) => {

        let tempstr = "";

        for(let item in data){
            tempstr = tempstr + item + "=" + data[item] + "&";
        }

        tempstr = tempstr.slice(0,tempstr.length - 1);
        tempstr = "text=test&" + tempstr;

        return tempstr;
    }

    callback = (key) => {
        const { dispatch } = this.props;

        dispatch({
            type: 'batchcode/fetch',
            payload:{
                type:key,
            }
        });

        this.setState({
            type:key,
        })
    }

    render() {

        const { dispatch, batchcode: { list }, loading } = this.props;

        let _this = this;

        const codesetProp = {
            data:this.state.data,
            textstyle:"none",
            onchange(paramstr){

                //关闭初始化
                let data = _this.state.data;
                data['init'] = false;
                //设置二维码的值
                if(_this.state.type == 3) {
                    _this.setState({
                        batchcode: paramstr,
                        data: data,
                        dataexp1: data,
                    })
                }else{
                    _this.setState({
                        batchcode2: paramstr,
                        data: data,
                        dataexp2: data,
                    })
                }
            }
        }

        const createbatchcode = () =>{

            let batchcode = "";
            if(this.state.type==3){
                batchcode = this.state.batchcode;
            }else{
                batchcode = this.state.batchcode2;
            }

            batchcode = "type=" + this.state.type + "&" + batchcode;

            dispatch({
                type: 'batchcode/saveBatchCode',
                payload:{
                    batchcode:batchcode,
                    type:this.state.type,
                }
            });
        }

        const createDefaultbatchcode = () =>{

            let batchcode = "type=" + this.state.type + "&" + "text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=";

            if(this.state.type==3){
                this.setState({
                    batchcode:batchcode,
                })
            }else{
                this.setState({
                    batchcode2:batchcode,
                })
            }

            dispatch({
                type: 'batchcode/saveBatchCode',
                payload:{
                    batchcode:batchcode,
                    type:this.state.type,
                }
            });
        }

        //起来导出Excel
        const exportExcel = () => {

            if(list.length>0) {

                document.getElementById("edata").value =  JSON.stringify(list);
                document.getElementById("eparam").value =  JSON.stringify(getCodeJson(this.state.dataexp1));
                document.getElementById("eparam2").value =  JSON.stringify(getCodeJson(this.state.dataexp2));

                let exportform = document.getElementById("export");
                exportform.submit();
            }else{
                message.error("没有可以导出的数据");
            }

        }

        const getCodeJson = (json) =>{
            //过滤掉#号
            for(var temp in json){
                var temp_val = json[temp];
                if(temp_val || temp_val==0){
                    if(temp=='bg' || temp=='fg' || temp=='wk' || temp=='nk'){
                        json[temp] = temp_val.replace("#","");
                    }else{
                        json[temp] = temp_val;
                    }
                }
            }

            return json;
        }

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:50,
            },
            {
                title: '母码内容',
                dataIndex: 'A',
                width:100,
            },
            {
                title: '生成',
                dataIndex: 'Aqr',
                render:val => <img src={api.createqrcode+"&"+this.state.batchcode.replace("test",val)} style={{width:100,height:100}}/>,
                width:100,
            },
            {
                title: '子码内容',
                dataIndex: 'B',
                width:100,
            },
            {
                title: '生成',
                dataIndex: 'Bqr',
                render:val => <img src={api.createqrcode+"&"+this.state.batchcode2.replace("test",val)} style={{width:100,height:100}}/>,
                width:100,
            }
        ];

        const props = {
            name: 'file',
            showUploadList:false,
            action: api.upload,
            onChange(info) {
                const status = info.file.status;

                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    //已经执行完成,后台开始处理excel
                    let fileList = info.fileList;
                    let excelpath = "";

                    let fileInfo = fileList[fileList.length - 1];
                    let name = fileInfo['name'];
                    let path = fileInfo['response']['path'];

                    if(/(\.xls){1}|(\.xlsx){1}/ig.test(name)){
                        //开始处理excel
                        excelpath = path;
                        dispatch({
                            type: 'batchcode/readQrExcel',
                            payload:{
                                excel:excelpath,
                            }
                        });
                    }else{
                        message.error("请上传Excel文件");
                    }

                } else if (status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };

        return (
            <Fragment>
                <Row gutter={24}>
                    <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card title="二维码列表" bordered={false}>
                            <Row gutter={24}>
                                <Col>
                                    <Table
                                        loading={loading}
                                        dataSource={list}
                                        columns={columns}
                                        scroll={{y:400}}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col>
                                    <div className={styles.center} style={{marginTop:15}}>
                                        <Upload {...props} style={{marginRight:20}}>
                                            <Button>
                                                <Icon type="upload" /> 导入Excel
                                            </Button>
                                        </Upload>
                                        <Button onClick={exportExcel}>导出Excel</Button>
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col>
                                    <div className={styles.batchnote}>注：在需要导入的Excel中录入两列数据分别对应母码和子码，不需要添加表头。</div>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col>
                                    <form method="post" action={api.exportqrexcel} id="export">
                                        <input type="hidden" name="data" value=""  id="edata"/>
                                        <input type="hidden" name="param" value=""  id="eparam"/>
                                        <input type="hidden" name="param2" value="" id="eparam2"/>
                                    </form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Card  title="二维码设置" bordered={false}>
                            <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="母码样式" key="4">
                                    <Row gutter={24}>
                                        <Col >
                                            <QrCodeSet {...codesetProp}></QrCodeSet>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col>
                                            <div className={styles.center}>
                                                <Button style={{marginRight:20}} onClick={createbatchcode}>生成二维码</Button>
                                                <Button onClick={createDefaultbatchcode}>设置默认样式</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="子码样式" key="5">
                                    <Row gutter={24}>
                                        <Col>
                                            <QrCodeSet {...codesetProp}></QrCodeSet>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col>
                                            <div className={styles.center}>
                                                <Button style={{marginRight:20}} onClick={createbatchcode}>生成二维码</Button>
                                                <Button onClick={createDefaultbatchcode}>设置默认样式</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </Fragment>

        );
    }
}
