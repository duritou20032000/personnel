import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Rate, Button, Switch } from 'antd';
import styles from './Company.less';

const FormItem = Form.Item;

@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
      content:"",
      labelco:['统一社会信用代码','企业名称','法人名称'],
      labelauth:['营业执照','注册资本','注册地址','企业法人',' iso 认证','企业资质'],
      keys:[
          "code",
          "name",
          "corp",
          "license",
          "license_apv",
          "capital",
          "capital_apv",
          "addr",
          "addr_apv",
          "corporation",
          "corporation_apv",
          "iso",
          "iso_apv",
          "aptitude",
          "aptitude_apv",
          "level",
          "home",
      ],
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
                const { onOk } = this.props
                let value = this.state.item;

                onOk(value);
                console.log(value);

                // this.props.dispatch({
                //     type: 'authset/set',
                //     payload:values
                // });
                // console.log(values);
            }
        });
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

    handleCheck = (e,key) =>{
      let item = this.state.item;
      item[key+"_apv"] = e?1:2;
      this.setState({
          item:item,
      })
    }

    handleChange = (value) =>{
        //星级返回值
        let item = this.state.item;
        item['level'] = value;
        this.setState({
            item:item,
        })
    }

  render() {
      const { bigImage, bigImageShow } = this.state;
      const { item, onCancel, onOk, loading, dispatch } = this.props;
      const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;

      const getFields = ()  => {

          const { item } = this.props;
          const { keys } = this.state;
          const children = [];
          const span = [10,7,7];
          for (let i = 0; i < 3; i++) {
              children.push(
                  <Col xs={span[i]} sm={8} key={i}>
                      <FormItem label={this.state.labelco[i]} >
                          {getFieldDecorator(keys[i], {
                              initialValue: item[keys[i]] ? item[keys[i]] : ''
                          })(
                              <Input placeholder="" disabled={true}/>
                          )}
                      </FormItem>
                  </Col>
              );
          }
          return children;
      }

      const getUploads = ()  => {

          const { item } = this.props;
          const { keys } = this.state;

          const children = [];
          for (let i = 0; i < 6; i++) {
              let tmpdata = item[keys[i*2+3]];
              let approve = item[keys[i*2+4]];
              let urlimage = "";

              urlimage = tmpdata;

              children.push(
                  <Col xs={12} sm={6} xl={4} key={i}>
                      <FormItem label={this.state.labelauth[i]} >
                          {getFieldDecorator(keys[i*2+3], {
                              initialValue: approve==1?true:false,
                          })(
                              <div>
                                  <div className={styles.approvePanel} onClick={()=>this.showImage(urlimage)}>
                                      {urlimage?<div style={{backgroundImage:'url('+urlimage+')',backgroundSize:'cover',backgroundPosition:'50%'}} className={styles.authImage}></div>:
                                          <div className={styles.authImage}>未上传图片</div>}
                                      <div className={styles.authCoverNote}>{urlimage?"点击查看大图":""}</div>
                                  </div>
                                  <Switch checkedChildren="通过" unCheckedChildren="未通过" defaultChecked={approve==1?true:false} onClick={(e)=>this.handleCheck(e,keys[i*2+3])}/>
                              </div>
                          )}
                      </FormItem>
                  </Col>
              );
          }
          return children;
      }

      const getRate = ()  => {

          const { item } = this.props;
          const { keys } = this.state;
          const children = [];

          children.push(
              <Col span={24} key={10}>
                  <FormItem label={'信用等级'} >
                      {getFieldDecorator(keys[15], {
                          initialValue: item['level']
                      })(
                          <Rate onChange={this.handleChange}/>
                      )}
                  </FormItem>
              </Col>
          );

          return children;
      }

      const getHome = ()  => {

          const { item } = this.props;
          const { keys } = this.state;
          const children = [];
          let content = item['home'];

          children.push(
              <Col span={24} key={11}>
                    <div dangerouslySetInnerHTML={{__html: content}}></div>
              </Col>
          );

          return children;
      }

      return (
        <Form
            onSubmit={this.handleSearch}
        >
            <Card
                type="inner"
                title="企业主页"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>{getHome()}</Row>
            </Card>

            <Card
                type="inner"
                title="企业信息"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>{getFields()}</Row>
            </Card>

            <Card
                type="inner"
                title="企业认证"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>{getUploads()}</Row>
            </Card>

            <Card
                type="inner"
                title="信用等级"
                extra={<a href="javascript:;"></a>}
            >
                <Row gutter={24}>{getRate()}</Row>
                <Row gutter={24}>
                    <Col span={24}  offset={18} >
                        <FormItem >
                            <Button type="primary" htmlType="submit" >保存</Button>
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
