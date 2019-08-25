import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button } from 'antd';

import styles from './RealUser.less';

const FormItem = Form.Item;

@Form.create()
export default class RealUserDetail extends PureComponent {
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
                title="个人信息"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="姓名" {...formItemLayout}>
                            {getFieldDecorator('username', {
                                initialValue: item['username'] ? item['username'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        <FormItem label="身份证号" {...formItemLayout} >
                            {getFieldDecorator('idno', {
                                initialValue: item['idno'] ? item['idno'] : ''
                            })(
                                <Input placeholder=""  disabled={true} style={{width:"200px"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
            <Card
                type="inner"
                title="身份证照片"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>
                    <Col xs={12} sm={12} className={styles.itemCenter}>
                        <FormItem label="身份证正面照片" >
                            {getFieldDecorator('username', {
                                initialValue: item['username'] ? item['username'] : ''
                            })(
                                <div>
                                    <div className={styles.approvePanel} onClick={()=>this.showImage(item['idcardfront'])}>
                                        {item['idcardfront']?<div style={{backgroundImage:'url('+item['idcardfront']+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                            <div className={styles.authImage}>没有图片</div>}
                                        <div className={styles.authCoverNote}>{item['idcardfront']?"点击查看大图":""}</div>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Col>

                    <Col xs={12} sm={12}  className={styles.itemCenter}>
                        <FormItem label="身份证反面照片" >
                            {getFieldDecorator('idno', {
                                initialValue: item['idno'] ? item['idno'] : ''
                            })(
                                <div>
                                    <div className={styles.approvePanel} onClick={()=>this.showImage(item['idcardback'])}>
                                        {item['idcardback']?<div style={{backgroundImage:'url('+item['idcardback']+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                            <div className={styles.authImage}>没有图片</div>}
                                        <div className={styles.authCoverNote}>{item['idcardback']?"点击查看大图":""}</div>
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
