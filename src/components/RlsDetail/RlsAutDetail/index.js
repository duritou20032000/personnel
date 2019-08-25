import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from "./index.less";
import { api } from "../../../utils/config";


export default class RlsAutDetail extends PureComponent{

    state = {
        header:"认证报告",
        footer:"",
        qrcode:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        curritem:{
            id:0,
            pass:3,
            class:"",
            info:"",
            oinfo:"",
            vtime:"",
            sign:"",
            sign_time:"",
            photo:"",
            name:"",
            create:"",
            att:[],
            codeurl:"",
        },
        bigImageShow:"none",
        bigImage:"",
        ploading: false,
        nloading: false,
        audit:false,
    }

    componentWillMount(){

        const { curritem, audit } = this.props;
        let item = this.state;
        for(let temp in curritem){
            item[temp] = curritem[temp];
        }

        let footer = curritem.pass!=3?curritem.pass!=1?"未找到相关信息, 请核对后重新申请认证.":"系统认证: 此查询结果真实无误, 具有该学校认证的法律效力!":"";

        this.setState({
            curritem:item,
            footer:footer,
            audit:audit,
        })
    }

    componentWillReceiveProps(nextProps){

    }

    hiddenImage = () =>{

        this.setState({
            bigImageShow:"none"
        })
    }

    showImage = (url) =>{
        if(url){
            this.setState({
                bigImageShow:"flex",
                bigImage:url,
            })
        }
    }

    download = (url) =>{

        document.getElementById("downloadform").action = url;
        document.getElementById("downloadform").submit();
    }

    render(){
        const { curritem, header, footer, bigImageShow, bigImage, downloadfile, audit } = this.state;
        const { onCancel, onOk } = this.props;

        const goback = () =>{

            onCancel();
        }

        //审核事件
        const handleApprove = (e) => {

            if(e==1){
                //按钮等待状态
                this.setState({
                    ploading:true,
                })
            }else{
                this.setState({
                    nloading:true,
                })
            }
            const data = this.state.curritem;
            onOk({id:data.id,pass:e});
        }

        const attlist = curritem.att.map((item,index) => {

            if(/(png|jpg|jpeg|gif)/.test(item)){
                return (
                    <img src={item} key={index} className={styles.attimg} onClick={()=>this.showImage(item)}/>
                )
            }else{
                //返回文件
                let suffix = item.match(/(\.\w+)$/)[0].replace(".","");

                return (
                    <div  key={index} className={styles.attfile} onClick={()=>this.download(item)}>
                        <img src="../../../../../image/attachment.jpg"/>
                        <div>{suffix}文件</div>
                    </div>
                )
            }

        });

        return (
            <div>
                <div className={styles.detailHead} style={{backgroundColor:curritem.pass!=3?curritem.pass==1?'#52c41a':'#f5222d':'#1890ff'}}>
                    <span>认证报告</span>
                </div>
                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>标题</label>
                        <div>{curritem.class}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>内容</label>
                        <div>{curritem.info}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>附件</label>
                        <div>{attlist}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>有效时间段</label>
                        <div>{curritem.vtime}</div>
                    </div>
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>电子签名</label>
                        <div>
                            <div className={styles.detailPhoto}>
                                {curritem.photo?<img src={curritem.photo} />:<div></div>}
                            </div>
                            <div className={styles.detailUInfo}>
                                <div className={styles.username}>{curritem.name}</div>
                                <div className="sign">{curritem.sign}</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>数字码</label>
                        <div>{curritem.sign}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>时间戳</label>
                        <div>{curritem.sign_time}</div>
                    </div>
                </div>

                {curritem.pass==1 &&
                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>系统认证</label>
                        <div>
                            <div className={styles.start}>
                                <div>已有系统签名认证</div>
                                <div className={styles.detailSystime}>{curritem.create}</div>
                            </div>
                            <div>{curritem.sign}</div>
                        </div>

                    </div>

                </div>}

                {curritem.pass==1 &&
                <div className={styles.detailBody}>
                    <div className={styles.center}>
                        <img src={curritem.codeurl} />
                    </div>
                </div>}

                <div className={styles.detailFooter} style={{backgroundColor:curritem.pass!=3?curritem.pass==1?'#52c41a':'#f5222d':'#1890ff'}}>
                    <span>{footer}</span>
                </div>

                <div className={styles.end + " " + styles.detailBack}>
                    {audit && <Button type="primary" htmlType="submit"  loading={this.state.ploading}  onClick={()=>handleApprove(1)}>审核通过</Button>}
                    {audit && <Button type="primary" htmlType="submit"  loading={this.state.nloading}  onClick={()=>handleApprove(2)} style={{marginLeft:"15px"}} >审核不通过</Button>}
                    <Button type="default" htmlType="submit" onClick={()=>goback()} style={{marginLeft:"15px"}}>返回</Button>
                </div>

                <div className={styles.bigImageBg} style={{display:bigImageShow}} onClick={()=>this.hiddenImage()}>
                    <img src={bigImage}/>
                </div>

                <form method="get" action="" id="downloadform">
                </form>
            </div>
        )
    }
}
