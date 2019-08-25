import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Tabs,  Button,  Icon, Select, Popover, Input } from 'antd';
import styles from './PsnlCard.less';
import PEPsnlCard from '../../../components/PEPsnlCard/index';
import CardTemplateSet from '../../../components/CardSet/CardTemplateSet/index';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ psnlcard, loading }) => ({
  psnlcard,
  loading: loading.models.psnlcard,
}))
@Form.create()
export default class PsnlCard extends PureComponent {
    state = {
        empinfo:{
            id:0,
            name:"",
            portrait:"",
            phone:"",
        },
        companylist:[],
        workinfo:{
            dept:"",
            pos:"",
            co:"",
        },
        cardlist:[],
        portrait:"../../../image/portrait.jpg",
        codepsnlurl:"",
        co_id:0,
        edittemplate:1,
        tempdata:{},
        type:2,
        id:0,
        title:"",
    };

    componentWillMount(){
        const { dispatch } = this.props;

        dispatch({
            type: 'psnlcard/fetch'
        });
    }

    componentWillReceiveProps(nextProps){
        const { psnlcard :{ empinfo, companylist, workinfo, cardlist, codepsnlurl, tempdata } } = nextProps;
        const portrait = empinfo.portrait?empinfo.portrait:"../../../image/portrait.jpg";

        const data = tempdata;
        if(JSON.stringify(data)!="{}"){
            //初始化数据
            let text = data.text,
                logo = data.logo,
                code = data.code,
                frontimage = data.frontimage,
                backimage = data.backimage,
                id = data.id;

            text = text?JSON.parse(text):"";
            logo = logo?JSON.parse(logo):"";
            code = code?JSON.parse(code):"";
            frontimage = frontimage?frontimage:"";
            backimage = backimage?backimage:"";
            id = id?id:0;

            this.setState({
                tempdata:{
                    logo:logo,
                    text:text,
                    code:code,
                    frontimage:frontimage,
                    backimage:backimage,
                },
                id:id,
            })
        }

        this.setState({
            empinfo:empinfo,
            companylist:companylist,
            workinfo:workinfo,
            cardlist:cardlist,
            portrait:portrait,
            codepsnlurl:codepsnlurl,
        })
    }

    render() {
        let _this = this;
        //type 1:公司模板  2.个人模板
        const { tempdata, type, id } = this.state;

        const imageError = () =>{
            //设置默认图片

            this.setState({
                portrait:"../../../image/portrait.jpg"
            })

        }

        const handleChange = (value) => {

            this.setState({
                co_id:value,
            });

            const { dispatch } = this.props;
            dispatch({
                type: 'psnlcard/fetch',
                payload:{
                    co_id:value,
                }
            });
        }

        const add = () =>{

            this.setState({
                edittemplate:2
            });
        }

        const back = () =>{

            this.setState({
                edittemplate:1
            });
        }

        const editcard = (id,title) =>{
            const { dispatch } = _this.props;

            dispatch({
                type: 'psnlcard/queryTemp',
                payload:{
                    id:id,
                    co_id:this.state.co_id,
                }
            });

            _this.setState({
                edittemplate:2,
                title:title,
            });
        }

        const delcard = (id) =>{

            const { dispatch } = _this.props;

            dispatch({
                type: 'psnlcard/delTemp',
                payload:{
                    id:id,
                    co_id:this.state.co_id,
                }
            });

        }

        const handleTextChange = (e) =>{

            const { value } = e.target;

            this.setState({
                title:value,
            })
        }

        const options = this.state.companylist.map(d => <Option key={d.id}>{d.name}</Option>);
        const psnloptions = this.state.cardlist.map(d => <PEPsnlCard
                                                    key={d.id}
                                                    codepsnlurl={this.state.codepsnlurl}
                                                    codeno={d.code_no}
                                                    title={d.title}
                                                    type={d.type}
                                                    id={d.temp_id}
                                                    editcard={editcard}
                                                    delcard={delcard}
                                                ></PEPsnlCard>);

        const cardtemplateProps = {
            data:tempdata,
            type:type,
            saveTemplate:function(data){
                const { dispatch } = _this.props;

                data['type'] = type;
                data['id'] = id;
                data['title'] = _this.state.title;

                dispatch({
                    type: 'psnlcard/saveInfo',
                    payload:data
                });
            }
        }

        return (
            <div>
                {this.state.edittemplate==1 && <Row gutter={24}>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Card  title="" bordered={false}>
                            <Row className={'${styles.center}'}>
                                <Col className={styles.center + " " + styles.colstyle}>
                                    <img src={this.state.portrait} className={styles.cardphoto} onError={imageError}/>
                                </Col>
                            </Row>

                            <Row className={styles.center}>
                                <Col className={styles.colstyle}>
                                    <div className={styles.cardname}>{this.state.empinfo.name}</div>
                                </Col>
                            </Row>

                            <Row className={styles.center}>
                                <Col className={styles.colstyle}>
                                    <Select defaultValue="1" onChange={handleChange}>
                                        {options}
                                    </Select>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="工作信息" bordered={false} className={styles.leftfont}>
                            <Row>
                                <Col className={styles.start + " " + styles.collstyle} >
                                    <Icon type="team" className={styles.lefticon}/><span>部门：</span><span>{this.state.workinfo.dept}</span>
                                </Col>
                            </Row>

                            <Row>
                                <Col className={styles.start + " " + styles.collstyle} >
                                    <Icon type="user" className={styles.lefticon}/><span>职位：</span><span>{this.state.workinfo.pos}</span>
                                </Col>
                            </Row>

                            <Row>
                                <Col className={styles.start + " " + styles.collstyle} >
                                    <Popover content={this.state.workinfo.co} title="">
                                        <Icon type="api" className={styles.lefticon}/><span>公司：</span><span>{this.state.workinfo.co}</span>
                                    </Popover>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="荣誉信息" bordered={false}>
                            <Row>
                                <Col className={styles.start + " " + styles.trophystyle} >
                                    <Icon type="trophy" className={styles.lefticon}/><span>英语四级</span><span>2018.04.02</span><Icon type="check" />
                                </Col>
                            </Row>

                            <Row>
                                <Col className={styles.start + " " + styles.trophystyle} >
                                    <Icon type="trophy" className={styles.lefticon}/><span>注册会计师</span><span>2018.04.02</span><Icon type="close" />
                                </Col>
                            </Row>

                            <Row>
                                <Col className={styles.start + " " + styles.trophystyle} >
                                    <Icon type="trophy" className={styles.lefticon}/><span>计算机等级考试</span><span>2018.04.02</span><Icon type="info" />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        {psnloptions}

                        <Card bordered={false}>
                            <div  className={styles.center}>
                                <Button type="dashed" onClick={add} style={{ width: '60%' }}>
                                    <Icon type="plus" /> 添加名片
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>}
                {this.state.edittemplate==2 &&
                    <div>
                        <Row gutter={24}>
                            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                                <div className={styles.start}>
                                    <span>设置名称：</span><Input style={{width:200}}  onChange={handleTextChange} value={this.state.title}/>
                                </div>
                            </Col>
                            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                                <div className={styles.end}>
                                    <Button type="default" onClick={back} style={{ width: 80 }}>返回</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CardTemplateSet {...cardtemplateProps}></CardTemplateSet>
                            </Col>
                        </Row>

                    </div>
                }
            </div>

        );
    }
}
