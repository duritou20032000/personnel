import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Tabs, Input, Table, Icon, Button, Dropdown, Menu, Popconfirm, message, Badge, Divider, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './QrCode.less';
import QrCodeSet from '../../../components/QrCodeSet/index';
import { api } from '../../../utils/config';


const TabPane = Tabs.TabPane;

@connect(({ qrcode, loading }) => ({
  qrcode,
  loading: loading.models.qrcode,
}))
@Form.create()
export default class QrCode extends PureComponent {
    state = {
        qrcode:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        text:"测试",
        type:1,
        data:{},
    };

    componentWillMount(){

        const { dispatch } = this.props;

        dispatch({
            type: 'qrcode/fetch',
            payload:{
                type:this.state.type,
            }
        });
    }

    componentWillReceiveProps(nextProps){

        let { qrcode:{ data } } = nextProps;

        let tempstr = "";
        for(let item in data){
            tempstr = tempstr + item + "=" + data[item] + "&";
        }

        tempstr = tempstr.slice(0,tempstr.length - 1);
        tempstr = "text=test&" + tempstr;
        //初始化
        data['init'] = true;

        this.setState({
            qrcode:tempstr,
            data:data,
        })

    }

    callback = (key) => {
        const { dispatch } = this.props;

        dispatch({
            type: 'qrcode/fetch',
            payload:{
                type:key,
            }
        });

        this.setState({
            type:key,
        })
    }

    render() {

        const { dispatch } = this.props;
        let _this = this;

        const qrcodesetProp = {
            data:this.state.data,
            onchange(paramstr){

                //关闭初始化
                let data = _this.state.data;
                data['init'] = false;
                //设置二维码的值
                _this.setState({
                    qrcode:paramstr,
                    data:data,
                })
            }
        }

        const createQrCode = () =>{

            let qrcode = "type=" + this.state.type + "&" + this.state.qrcode;

            dispatch({
                type: 'qrcode/saveQrCode',
                payload:{
                    qrcode:qrcode,
                    type:this.state.type,
                }
            });
        }

        const createDefaultQrCode = () =>{

            let qrcode = "type=" + this.state.type + "&" + "text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=";
            this.setState({
                qrcode:qrcode,
            })

            dispatch({
                type: 'qrcode/saveQrCode',
                payload:{
                    qrcode:qrcode,
                    type:this.state.type,
                }
            });
        }

        return (
            <Fragment>
                <Row gutter={24}>
                    <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card  title="二维码设置" bordered={false}>
                            <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="名片二维码" key="1">
                                    <Row gutter={24}>
                                        <Col>
                                            <QrCodeSet {...qrcodesetProp}></QrCodeSet>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col>
                                            <div className={styles.center}>
                                                <Button style={{marginRight:20}} onClick={createQrCode}>生成二维码</Button>
                                                <Button onClick={createDefaultQrCode}>设置默认样式</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="登录二维码" key="2">
                                    <Row gutter={24}>
                                        <Col>
                                            <QrCodeSet {...qrcodesetProp}></QrCodeSet>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col>
                                            <div className={styles.center}>
                                                <Button style={{marginRight:20}} onClick={createQrCode}>生成二维码</Button>
                                                <Button onClick={createDefaultQrCode}>设置默认样式</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="公告二维码" key="3">
                                    <Row gutter={24}>
                                        <Col>
                                            <QrCodeSet {...qrcodesetProp}></QrCodeSet>
                                        </Col>
                                    </Row>

                                    <Row gutter={24}>
                                        <Col>
                                            <div className={styles.center}>
                                                <Button style={{marginRight:20}} onClick={createQrCode}>生成二维码</Button>
                                                <Button onClick={createDefaultQrCode}>设置默认样式</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>

                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Card title="二维码预览" bordered={false}>
                            <div className={styles.center}>
                                <img src={api.createqrcode+"&"+this.state.qrcode} />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Fragment>

        );
    }
}
