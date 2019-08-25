import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Rate, Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PicturesWall from '../../../components/PicturesWall/index';
import {api} from '../../../utils/config';

import styles from './AuthSet.less';

const FormItem = Form.Item;

@connect(({ authset, loading }) => ({
  authset,
  loading: loading.models.authset,
}))
@Form.create()
export default class authset extends PureComponent {
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
          "level"],

  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authset/fetch',
    });
  }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);
            if(!err){
                this.props.dispatch({
                    type: 'authset/set',
                    payload:values
                });
                // console.log(values);
            }
        });
    }

    handleImageDel = (key) =>{

        this.props.dispatch({
            type: 'authset/del',
            payload:{
                key:key
            }
        });
    }

    handleImageUpload = (key,url) =>{

       //上传的图片url回填到form
        const { setFieldsValue } = this.props.form;
        let data = {};
        data[key] = url;

        setFieldsValue(data);

        this.props.dispatch({
            type: 'authset/add',
            payload:{
                key:key
            }
        });
    }

  render() {
      const { authset: { data, modalVisible }, loading, dispatch } = this.props;
      const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;

      const getFields = ()  => {

          const { authset:{ data } } = this.props;
          const { keys } = this.state;
          const children = [];
          const span = [10,7,7];
          for (let i = 0; i < 3; i++) {
              children.push(
                  <Col xs={span[i]} sm={8} key={i}>
                      <FormItem label={this.state.labelco[i]} className={styles.antFormItem}>
                          {getFieldDecorator(keys[i], {
                              initialValue: data[keys[i]] ? data[keys[i]] : ''
                          })(
                              <Input placeholder=""/>
                          )}
                      </FormItem>
                  </Col>
              );
          }
          return children;
      }

      const getUploads = ()  => {

          const { authset:{ data } } = this.props;
          const { keys } = this.state;

          const children = [];
          for (let i = 0; i < 6; i++) {
              let tmpdata = data[keys[i*2+3]];
              let url = "";

              if(Object.prototype.toString.call(tmpdata).toLowerCase() == "[object object]" ){
                  //初始化图片
                  url = tmpdata['url'];
              }

              children.push(
                  <Col xs={12} sm={6} xl={4} key={i}>
                      <FormItem label={this.state.labelauth[i]} >
                          {getFieldDecorator(keys[i*2+3], {
                              initialValue: url,
                          })(
                              <PicturesWall
                                  approve={data[keys[i*2+4]] - 1}
                                  image={tmpdata}
                                  keyval={keys[i*2+3]}
                                  imagedel={this.handleImageDel}
                                  imageadd={this.handleImageUpload}
                                  uploadurl={api.upload}
                              />
                          )}
                      </FormItem>
                  </Col>
              );
          }
          return children;
      }

      const getRate = ()  => {

          const { authset:{ data } } = this.props;
          const { keys } = this.state;
          const children = [];

          children.push(
              <Col span={24} key={10}>
                  <FormItem label={'信用等级'} className={styles.antFormItem}>
                      {getFieldDecorator(keys[15], {
                          initialValue: data['level']
                      })(
                          <Rate disabled />
                      )}
                  </FormItem>
              </Col>
          );

          return children;
      }

      return (
      <PageHeaderLayout title="">
        {/*<Card bordered={false}>*/}
            <Form
                className={styles.antAdvancedSearchForm}
                onSubmit={this.handleSearch}
            >
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
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </Form>
        {/*</Card>*/}
      </PageHeaderLayout>
    );
  }
}
