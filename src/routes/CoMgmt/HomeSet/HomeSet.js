import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, message, Tabs } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditModel from '../../../components/EditModel/EditModel.js';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(({ homeset, loading }) => ({
  homeset,
  loading: loading.models.homeset,
}))
@Form.create()
export default class homeset extends PureComponent {
  state = {
      content:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeset/fetch',
    });
  }

    onChange = (content) =>{

        let contentValue = content;
        this.setState({
            content:contentValue
        })
    }

    render() {
    const { homeset: { data, modalVisible }, loading, dispatch } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;


      const formItemLayout = {
          // labelCol: {
          //     span: 2,
          // },
          wrapperCol: {
              xs: { span: 18, offset: 0 },
              sm: { span: 19, offset: 0 },
          },
      }

      const formContentLayout = {
          labelCol: {
              span: 6,
          },
          wrapperCol: {
              span: 18,
          },
      }

      const formItemLayoutWithOutLabel = {
          wrapperCol: {
              xs: { span: 24, offset: 18 },
              sm: { span: 20, offset: 18 },
          },
      }

      const item = [];

      const handleSubmit = (e) => {
          e.preventDefault()
          validateFields((err, values) => {
              if (!err) {

                  if(!values["content"]){
                      message.error("请填写内容！");
                      return;
                  }

                  dispatch({
                      type: `homeset/set`,
                      payload: values,
                  })

              }
          })
      }

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="主页预览" key="1">
                    <div dangerouslySetInnerHTML={{__html: data.data}}></div>
                </TabPane>
                <TabPane tab="编辑主页" key="2">
                  <Form layout="horizontal" onSubmit={handleSubmit}>

                    <FormItem label="" hasFeedback  {...formItemLayout} >
                        {getFieldDecorator('content', {
                            initialValue:data.data,
                            rules: [
                                {
                                    message: '请填写内容',
                                },
                            ],
                        })(
                            <EditModel></EditModel>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayoutWithOutLabel}>
                      <Button type="primary" htmlType="submit" >保存</Button>
                    </FormItem>
                  </Form>
                </TabPane>
            </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
