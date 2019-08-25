import React, { Component } from 'react';
import { Card, Icon, Modal } from 'antd';
import styles from './index.less';
import {api} from '../../utils/config';
const confirm = Modal.confirm;


/**
 * 个人名片模块-名片显示插件
 */
export default class PEPsnlCard extends Component {
    state = {
        id:0,
        title:"",
        caret:"up",
        height:727,
        code_no:"5b0f3010ae39a",
        qrcodeurl:"text=http://140.143.201.34:8081/codeurl/",
        type:1,
    };

    componentWillReceiveProps(nextProps){

        const { id,title, codeno, codepsnlurl, type } = nextProps;

        this.setState({
            id:id,
            type:type,
            code_no:codeno,
            title:title,
            qrcodeurl:"text="+codepsnlurl,
        })
    }

    render() {

        // 面板展开控制
        const expandpanel = () =>{

            if(this.state.height){

                this.setState({
                    height:0,
                    caret:"down",
                })
            }else{
                this.setState({
                    height:727,
                    caret:"up",
                })
            }
        }

        const handleeditcard = () =>{

            this.props.editcard(this.state.id,this.state.title);
        }

        const handledelcard = () =>{


        }

        const showDeleteConfirm = () =>{
            let _this = this;
            confirm({
                title: '你确定要删除这个模板吗？',
                content: '',
                okText: '是的',
                cancelText: '取消',
                onOk() {
                    _this.props.delcard(_this.state.id);
                },
                onCancel() {

                },
            });
        }

        return (
            <Card title={this.state.title} extra={
                <div className={styles.iconstyle}>
                    {this.state.type==2 && <Icon type="edit" onClick={handleeditcard}/>}
                    {this.state.type==2 && <Icon type="close"  onClick={showDeleteConfirm}/>}
                    <Icon type={this.state.caret} onClick={expandpanel}/>
                </div>
            } bordered={false}>
                <div style={{height:this.state.height}} className={styles.expandpanel}>
                    <div className={styles.cardLayout + " " + styles.center}>
                        <img src={api.exportpsnl + "&code_no=" + this.state.code_no + "&v=" + Math.random()}/>
                    </div>
                    <div className={styles.cardLayout + " " + styles.center}>
                        <img src={api.exportpsnlback + "&code_no=" + this.state.code_no + "&v=" + Math.random()}/>
                    </div>

                    <div className={styles.codepanel + " " + styles.center}>
                        <img src={api.createsysqrcode + "&" + this.state.qrcodeurl + this.state.code_no } className={styles.codestyle}/>
                        <Icon type="share-alt" className={styles.sharebtn}/>
                    </div>

                    <div className={styles.note + " " + styles.center}>
                        <span>扫码添加好友</span>
                    </div>
                </div>
            </Card>
        );
    }
}
