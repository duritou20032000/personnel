import React, { PureComponent } from 'react';

import { Card  } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './RlsAut.less';


export default class AutCode extends PureComponent {
    state = {
        way:2,
        url:"",
        intervalnum:59,
        clear:false,
        count:0,
        autid:0,
    }

    componentWillMount(){

    }

    componentDidMount() {
        const { dispatch } = this.props;

        //直接获取code
        dispatch({
            type: 'login/getcode',
            payload:{
                way:this.state.way,
            }
        })

        this.countdown();
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    componentWillReceiveProps(nextProps){

        const { codeurl, clear, autid } = nextProps;
        this.setState({
            url:codeurl,
            clear:clear,
            autid:autid,
        })
    }

    countdown = () =>{
        clearInterval(this.interval);
        let count = this.state.intervalnum,_this = this;
        this.setState({ count });

        this.interval = setInterval(() => {
            count -= 1;
            this.props.dispatch({
                type: 'rlsaut/checkcode',
                payload:{
                    id:_this.state.autid,
                },
                callback:()=>{
                    //直接跳转到历史记录
                    _this.props.handleScan();
                }
            })
            this.setState({ count });
            let clear = _this.state.clear;
            if (count === 0 || clear) {
                clearInterval(this.interval);
            }
        }, 1000);
    }

    render() {


        return (
            <PageHeaderLayout title="">
                <Card title="申请人身份确认" bordered={false}>
                    <div className={styles.itemCenter} style={{margin:"10px auto 30px auto"}}><img src={this.state.url} style={{margin:"5px auto"}}/></div>
                    <div className={styles.itemCenter}>请在小程序中扫码确认.(剩余: {this.state.count}s)</div>
                    <div className={styles.itemCenter}>须已完成实名认证.</div>
                </Card>
            </PageHeaderLayout>
        );
    }
}