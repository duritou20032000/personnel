import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card  } from 'antd';
import {api} from '../../../utils/config';
import SingleImgUpload from '../../../components/SingleImgUpload/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ idcard }) => ({
    idcard,
}))
@Form.create()
export default class Idcard extends PureComponent {
  state = {

  }

  componentWillMount(){

  }

  componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
          type: 'idcard/fetch',
      });
  }

  componentWillReceiveProps(nextProps){

  }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {

                values['idcard_back'] =  values['idcard_back']?values['idcard_back'][0].response.path:"";
                values['idcard_front'] =  values['idcard_front']?values['idcard_front'][0].response.path:"";

                this.props.dispatch({
                    type: 'idcard/saveinfo',
                    payload: {
                        ...values,
                    },
                });
            }
        });
    };

    normFile = (e) => {

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

  render() {
      const { idcard: { data } } = this.props;
      const { form, submitting } = this.props;
      const { getFieldDecorator } = form;

      const formItemLayout = {
          labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
          },
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 19 },
          },
      };

      const formNoLabelLayout = {
          wrapperCol: {
              xs: {span: 24, offset: 0},
              sm: {span: 19, offset: 5},
          }
      };

    return (
        <PageHeaderLayout title="">
        <Card title="实名认证" bordered={false}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="用户名" {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue:data.username?data.username:"",
                        rules: [
                            {
                                required: true,
                                message: '请输入用户名！',
                            },
                        ],
                    })(<Input placeholder="用户名" style={{width:"200px"}}/>)}
                </FormItem>

                <FormItem label="身份证号" {...formItemLayout}>
                    {getFieldDecorator('idno', {
                        initialValue:data.idno?data.idno:"",
                        rules: [
                            {
                                required: true,
                                message: '请输入身份证号！',
                            },
                        ],
                    })(<Input placeholder="身份证号" style={{width:"200px"}} />)}
                </FormItem>

                <FormItem  label="身份证正面" {...formItemLayout}>
                    {getFieldDecorator('idcard_front', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [
                            {
                                required: true,
                                message: '请上传身份证正反面！',
                            },
                        ],
                    })(<SingleImgUpload url={ api.upload }  onChange={this.normFile}/>)}
                </FormItem>

                <FormItem  label="身份证反面" {...formItemLayout}>
                    {getFieldDecorator('idcard_back', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [
                            {
                                required: true,
                                message: '请上传身份证正反面！',
                            },
                        ],
                    })(<SingleImgUpload url={ api.upload }   onChange={this.normFile}/>)}
                </FormItem>

                <FormItem {...formNoLabelLayout}>
                    <Button
                        loading={submitting}
                        type="primary"
                        htmlType="submit"
                    >
                        提交
                    </Button>
                </FormItem>
            </Form>
        </Card>
        </PageHeaderLayout>
    );
  }
}
