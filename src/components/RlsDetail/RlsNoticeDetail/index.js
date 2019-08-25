import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import styles from "./index.less";
import { api } from "../../../utils/config";


export default class RlsNoticeDetail extends PureComponent{

    state = {
        header:"认证报告",
        auditstr:"",
        qrcode:"text=test&bg=ffffff&fg=000000&wk=000000&nk=000000&size=250&radio=1&level=L&logo=",
        curritem:{
            id:0,
            pass:3,
            title:"",
            content:"",
            vtime:"",
            sign:"",
            sign_time:"",
            photo:"",
            name:"",
            create:"",
            att:[],
        },
        bigImageShow:"none",
        bigImage:"",
        ploading: false,
        nloading: false,
        audit:false,
        preview:false,
    }

    componentWillMount(){

        const { curritem, audit, preview } = this.props;
        let item = this.state;
        for(let temp in curritem){
            item[temp] = curritem[temp];
        }

        let auditstr = curritem.pass!=3?curritem.pass!=1?"审核未通过":"上述内容已由系统认证":"待审核，请稍后....";

        this.setState({
            curritem:item,
            auditstr:auditstr,
            audit:audit,
            preview:!!preview,
        })
    }

    componentWillReceiveProps(nextProps){

        const { curritem, audit, preview, loading } = nextProps;
        console.log(nextProps)
        let item = this.state;
        for(let temp in curritem){
            item[temp] = curritem[temp];
        }

        let auditstr = curritem.pass!=3?curritem.pass!=1?"审核未通过":"上述内容已由系统认证":"待审核，请稍后....";

        this.setState({
            curritem:item,
            auditstr:auditstr,
            audit:audit,
            preview:!!preview,
            nloading: typeof loading=="boolean"?loading:this.state.nloading,
        })
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

    confirm = () =>{

        this.setState({
            nloading:true,
        })

        this.props.submit();
    }

    render(){
        const { curritem, header, auditstr, bigImageShow, bigImage, downloadfile, audit, preview } = this.state;
        const { onCancel, onOk, onEdit, submit } = this.props;

        const goback = () =>{

            onCancel();
        }

        const gobackEdit = () =>{

            onEdit();
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
                        <div dangerouslySetInnerHTML={{
                            __html: curritem.content
                        }}></div>
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

                {!preview && <div className={styles.detailBody}>
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

                </div>}

                {!preview && <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>数字码</label>
                        <div>{curritem.sign}</div>
                    </div>

                    <div className={styles.detailRow}>
                        <label>时间戳</label>
                        <div>{curritem.sign_time}</div>
                    </div>
                </div>}

                {!preview && <div className={styles.detailBody}>
                    <div className={styles.detailRow}>
                        <label>系统认证</label>
                        <div>
                            <div className={styles.start}>
                                <div style={{color:curritem.pass!=3?curritem.pass==1?'#52c41a':'#f5222d':'#1890ff'}}>{auditstr}</div>
                                {curritem.pass==1 && <div className={styles.detailSystime}>{curritem.create}</div>}
                            </div>
                            {curritem.pass!=2 && <div>{curritem.sign_sys}</div>}
                        </div>

                    </div>

                </div>}

                {curritem.pass!=2 &&
                <div className={styles.detailBody}>
                    <div className={styles.center}>
                        {/*<img src={api.createqrcode+"&"+this.state.qrcode} />*/}
                        <img src={curritem.codeurl} />
                    </div>
                </div>}

                <div className={styles.end + " " + styles.detailBack}>
                    {audit && <Button type="primary" htmlType="submit"  loading={this.state.ploading}  onClick={()=>handleApprove(1)}>审核通过</Button>}
                    {audit && <Button type="primary" htmlType="submit"  loading={this.state.nloading}  onClick={()=>handleApprove(2)} style={{marginLeft:"15px"}} >审核不通过</Button>}
                    {!preview && <Button type="default" htmlType="submit" onClick={()=>goback()} style={{marginLeft:"15px"}}>返回</Button>}
                    {preview && <Button type="default" htmlType="submit" onClick={()=>gobackEdit()} style={{marginLeft:"15px"}}>返回编辑</Button>}
                    {preview &&
                    <Popconfirm placement="leftTop" title="确认提交 提交后将有法律效力" onConfirm={this.confirm} okText="确认" cancelText="取消">
                        <Button type="default" htmlType="submit" style={{marginLeft:"15px"}}  loading={this.state.nloading} >确认提交</Button>
                    </Popconfirm>
                    }
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
