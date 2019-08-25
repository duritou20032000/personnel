import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button } from 'antd';

import styles from './RealCoInfo.less';

const FormItem = Form.Item;

@Form.create()
export default class RealCoInfoDetail extends PureComponent {
  state = {
      bigImage:"",
      bigImageShow:"none",
      item:{},
  };

  componentWillMount() {
      this.setState({
          item:this.props.item,
      })
  }

  componentWillReceiveProps(nextProps){

      this.setState({
          item:nextProps.item,
      })
  }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);
            if(!err){

            }
        });
    }

    //审核事件
    handleApprove = (e) => {

        const { onOk } = this.props;
        const data = this.state.item;
        onOk({id:data.id,pass:e});
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

  render() {
      const { bigImage, bigImageShow } = this.state;
      const { item, onCancel, onOk, loading, dispatch } = this.props;
      const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;
      const formItemLayout = {
          labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
          },
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
          },
      };

      return (
        <Form
            onSubmit={this.handleSearch}
        >
            <Card
                type="inner"
                title="企业信息"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="企业名称" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: item['name'] ? item['name'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="统一社会信用代码" {...formItemLayout} >
                            {getFieldDecorator('code', {
                                initialValue: item['code'] ? item['code'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="注册资本" {...formItemLayout} >
                            {getFieldDecorator('capital_text', {
                                initialValue: item['capital_text'] ? item['capital_text'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="注册地址" {...formItemLayout} >
                            {getFieldDecorator('addr_text', {
                                initialValue: item['addr_text'] ? item['addr_text'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="经营范围" {...formItemLayout} >
                            {getFieldDecorator('operate', {
                                initialValue: item['operate'] ? item['operate'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="营业执照" {...formItemLayout} >
                            {getFieldDecorator('operate', {
                                initialValue: item['operate'] ? item['operate'] : ''
                            })(
                                <div>
                                    <div className={styles.approvePanel} onClick={()=>this.showImage(item['license'])}>
                                        {item['license']?<div style={{backgroundImage:'url('+item['license']+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                            <div className={styles.authImage}>没有图片</div>}
                                        <div className={styles.authCoverNote}>{item['license']?"点击查看大图":""}</div>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
            <Card
                type="inner"
                title="法人信息"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="法人姓名" {...formItemLayout} >
                            {getFieldDecorator('corp', {
                                initialValue: item['corp'] ? item['corp'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="法人身份证号" {...formItemLayout} >
                            {getFieldDecorator('corp_idno', {
                                initialValue: item['corp_idno'] ? item['corp_idno'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="法人手机号" {...formItemLayout} >
                            {getFieldDecorator('corp_phone', {
                                initialValue: item['corp_phone'] ? item['corp_phone'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="法人身份证正面" {...formItemLayout} >
                            {getFieldDecorator('corp_picfront', {
                                initialValue: item['corp_picfront'] ? item['corp_picfront'] : ''
                            })(
                                <div>
                                    <div className={styles.approvePanel} onClick={()=>this.showImage(item['corp_picfront'])}>
                                        {item['corp_picfront']?<div style={{backgroundImage:'url('+item['corp_picfront']+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                            <div className={styles.authImage}>没有图片</div>}
                                        <div className={styles.authCoverNote}>{item['corp_picfront']?"点击查看大图":""}</div>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="法人身份证背面" {...formItemLayout} >
                            {getFieldDecorator('corp_picback', {
                                initialValue: item['corp_picback'] ? item['corp_picback'] : ''
                            })(
                                <div>
                                    <div className={styles.approvePanel} onClick={()=>this.showImage(item['corp_picback'])}>
                                        {item['corp_picback']?<div style={{backgroundImage:'url('+item['corp_picback']+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                            <div className={styles.authImage}>没有图片</div>}
                                        <div className={styles.authCoverNote}>{item['corp_picback']?"点击查看大图":""}</div>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}  offset={15} >
                        <FormItem >
                            <Button type="primary" htmlType="submit" onClick={()=>this.handleApprove(2)}>审核通过</Button>
                            <Button type="primary" htmlType="submit" onClick={()=>this.handleApprove(3)} style={{marginLeft:"15px"}} >审核不通过</Button>
                            <Button type="default" htmlType="submit" onClick={()=>onCancel()} style={{marginLeft:"15px"}}>返回</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Card>
            <div className={styles.bigImageBg} style={{display:bigImageShow}} onClick={()=>this.hiddenImage()}>
                <img src={bigImage}/>
            </div>
        </Form>
    );
  }
}
