import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from "./index.less";
import { api } from "../../../utils/config";


export default class RlsSealDetail extends PureComponent{

    state = {
        header:"认证报告",
        auditstr:"",
        qrcode:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        curritem:{
            id:0,
            pass:3,
            title:"",
            content:"",
            sealname:"",
            vtime:"",
            sign:"",
            sign_time:"",
            photo:"",
            name:"",
            create:"",
            att:[],
            signer:[],
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

        let auditstr = curritem.pass!=3?curritem.pass!=1?"审核未通过":"上述内容已由系统认证":"待审核，请稍后....";

        this.setState({
            curritem:item,
            auditstr:auditstr,
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
        const { curritem, header, auditstr, bigImageShow, bigImage, downloadfile, audit } = this.state;
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
                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>标题</label>
                        <div>{curritem.title}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>内容</label>
                        <div>{curritem.content}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>附件</label>
                        <div>{attlist}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>印章</label>
                        <div>{curritem.sealname}</div>
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

                <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>系统认证</label>
                        <div>
                            <div className={styles.start}>
                                <div style={{color:curritem.pass!=3?curritem.pass==1?'#52c41a':'#f5222d':'#1890ff'}}>{auditstr}</div>
                                {curritem.pass==1 && <div className={styles.detailSystime}>{curritem.create}</div>}
                            </div>
                            {curritem.pass==1 && <div>{curritem.sign}</div>}
                        </div>

                    </div>

                </div>

                {curritem.pass==1 &&
                <div className={styles.detailBody}>
                    <div className={styles.center}>
                        <img src={api.createqrcode+"&"+this.state.qrcode} />
                    </div>
                </div>}

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
