import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress, Tabs, Checkbox, Divider, message, Upload, Icon  } from 'antd';
import { api } from '../../utils/config';
import styles from './Register.less';
import SingleImgUpload from '../../components/SingleImgUpload';
import { md5 } from '../../utils/md5';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    type:1,
    agreement:false,
    verifyurl:api.verify+"&v="+Math.random(),
  };

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {

    const { form } = this.props;
    const mobile = form.getFieldValue('mobile');

    if(!mobile){
        message.error("请填写手机号");
        return;
    }

    let count = 59;
    this.setState({ count });

    this.props.dispatch({
        type:'register/sendsmscode',
        payload:{
          phone:mobile,
        }
    })

    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {

          var password = values.password;
          values.password = md5(password);

        this.props.dispatch({
          type: 'register/indvsubmit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleCoSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields({ force: true }, (err, values) => {
          if (!err) {

              values['corp_picback'] =  values['corp_picback']?values['corp_picback'][0].response.path:"";
              values['corp_picfront'] =  values['corp_picfront']?values['corp_picfront'][0].response.path:"";
              values['license'] =  values['license']?values['license'][0].response.path:"";
              values.password = md5(values.password);

              this.props.dispatch({
                  type: 'register/cosubmit',
                  payload: {
                      ...values,
                  },
              });
          }
      });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  blurPassword = () =>{
    //离开后关闭提示
    this.setState({
        visible:false,
    })
  }

  changePrefix = (value) => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  /**
   * tab页回调
   * @param key
   */
  callback = (key) => {
      //设置当前状态是企业还是个人注册
      this.setState({
          type:key,
      })
  }

  /**
   * 是否同意协议
   */
  changeAgreement = () =>{

    this.setState({
        agreement:!this.state.agreement
    })
  }

  /**
   * 改变验证码
   * @returns {XML}
   */
  changeVerify = () =>{
    this.setState({
        verifyurl:api.verify+"&v="+Math.random()
    })
  }

    //获取upload的值
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, type } = this.state;

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
        <div className={styles.main}>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="个人注册" key="1" >

              {type==1 && <Form onSubmit={this.handleSubmit}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名！',
                      },
                    ],
                  })(<Input size="large" placeholder="用户名" />)}
                </FormItem>
                <FormItem help={this.state.help} label="密码" {...formItemLayout}>
                  <Popover
                    content={
                      <div style={{ padding: '4px 0' }}>
                        {passwordStatusMap[this.getPasswordStatus()]}
                        {this.renderPasswordProgress()}
                        <div style={{ marginTop: 10 }}>
                          请至少输入 6 个字符。请不要使用容易被猜到的密码。
                        </div>
                      </div>
                    }
                    overlayStyle={{ width: 240 }}
                    placement="right"
                    visible={this.state.visible}
                  >
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required:true,
                          validator: this.checkPassword,
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        type="password"
                        placeholder="至少6位密码，区分大小写"
                        onBlur={()=>this.blurPassword()}
                      />
                    )}
                  </Popover>
                </FormItem>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: '请确认密码！',
                      },
                      {
                        validator: this.checkConfirm,
                      },
                    ],
                  })(<Input size="large" type="password" placeholder="确认密码" />)}
                </FormItem>
                <FormItem label="手机号" {...formItemLayout}>
                  <InputGroup compact>
                    <Select
                      size="large"
                      value={prefix}
                      onChange={this.changePrefix}
                      style={{ width: '20%' }}
                    >
                      <Option value="86">+86</Option>
                      <Option value="87">+87</Option>
                    </Select>
                    {getFieldDecorator('mobile', {
                      rules: [
                        {
                          required: true,
                          message: '请输入手机号！',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '手机号格式错误！',
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        style={{ width: '80%' }}
                        placeholder="11位手机号"
                      />
                    )}
                  </InputGroup>
                </FormItem>
                <FormItem label="验证码" {...formItemLayout}>
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator('captcha', {
                        rules: [
                          {
                            required: true,
                            message: '请输入验证码！',
                          },
                        ],
                      })(<Input size="large" placeholder="验证码" />)}
                    </Col>
                    <Col span={8}>
                      <Button
                        size="large"
                        disabled={count}
                        className={styles.getCaptcha}
                        onClick={this.onGetCaptcha}
                      >
                        {count ? `${count} s` : '获取验证码'}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="图像码" {...formItemLayout}>
                  <Row gutter={8}>
                    <Col span={16}>
                        {getFieldDecorator('verify', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入图像码！',
                                },
                            ],
                        })(<Input size="large" placeholder="图像码" />)}
                    </Col>
                    <Col span={8}>
                      <img src={this.state.verifyurl} style={{width:"100%",height:"38px",marginTop:"-3px"}} onClick={()=>this.changeVerify()}/>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem {...formNoLabelLayout}>
                    {getFieldDecorator('agree', {
                        rules: [
                            {
                                required:true,
                                message: '请勾选阅读并同意注册协议！',
                            },
                            {
                                pattern: /^(true)$/ig,
                                message: '请勾选阅读并同意注册协议！',
                            },
                        ],
                    })(<Checkbox checked={this.state.agreement } onChange={this.changeAgreement}>注册协议<Link to="/user/agreement"  target="_blank">《注册协议》</Link></Checkbox>)}
                </FormItem>
                <FormItem {...formNoLabelLayout}>
                  <Button
                      size="large"
                      loading={submitting}
                      className={styles.submit}
                      type="primary"
                      htmlType="submit"
                  >
                    注册
                  </Button>
                  <Link className={styles.login} to="/user/login">
                    使用已有账户登录
                  </Link>
                </FormItem>
              </Form>}
          </TabPane>

          <TabPane tab="企业注册" key="2">
              {type==2 && <Form onSubmit={this.handleCoSubmit}>
                <Divider orientation="left">公司信息</Divider>
                  <FormItem  label="企业名称" {...formItemLayout}>
                    {getFieldDecorator('coname', {
                        rules: [
                            {
                                required: true,
                                message: '请输入企业名称！',
                            },
                        ],
                    })(<Input size="large" placeholder="企业名称" />)}
                </FormItem>
                <FormItem  label="信用代码" {...formItemLayout}>
                    {getFieldDecorator('cocode', {
                        rules: [
                            {
                                required: true,
                                message: '请输入统一社会信用代码！',
                            },
                        ],
                    })(<Input size="large" placeholder="统一社会信用代码" />)}
                </FormItem>

                <FormItem  label="注册资本" {...formItemLayout}>
                    {getFieldDecorator('cocapital', {
                        rules: [
                            {
                                required: true,
                                message: '请输入注册资本！',
                            },
                        ],
                    })(<Input size="large" placeholder="注册资本" />)}
                </FormItem>

                <FormItem  label="注册地址" {...formItemLayout}>
                    {getFieldDecorator('coaddr', {
                        rules: [
                            {
                                required: true,
                                message: '请输入注册地址！',
                            },
                        ],
                    })(<Input size="large" placeholder="注册地址" />)}
                </FormItem>

                <FormItem  label="经营范围" {...formItemLayout}>
                    {getFieldDecorator('operate', {
                        rules: [
                            {
                                required: true,
                                message: '请输入经营范围！',
                            },
                        ],
                    })(<TextArea size="large" rows={4} placeholder="经营范围" />)}
                </FormItem>

                <FormItem  label="营业执照" {...formItemLayout}>
                    {getFieldDecorator('license', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [
                            {
                                required: true,
                                message: '请上传营业执照！',
                            },
                        ],
                    })(
                        <SingleImgUpload  url={ api.upload } onChange={this.normFile}/>
                    )}
                </FormItem>

              <Divider orientation="left">法人信息</Divider>

                <FormItem  label="法人名称" {...formItemLayout}>
                    {getFieldDecorator('corp_name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入法人名称！',
                            },
                        ],
                    })(<Input size="large" placeholder="法人名称" />)}
                </FormItem>

                <FormItem  label="身份证号" {...formItemLayout}>
                    {getFieldDecorator('corp_idno', {
                        rules: [
                            {
                                required: true,
                                message: '请输入法人身份证号！',
                            },
                        ],
                    })(<Input size="large" placeholder="法人身份证号" />)}
                </FormItem>

                <FormItem  label="手机号" {...formItemLayout}>
                    {getFieldDecorator('corp_phone', {
                        rules: [
                            {
                                required: true,
                                message: '请输入法人手机号！',
                            },
                        ],
                    })(<Input size="large" placeholder="法人手机号" />)}
                </FormItem>

                <FormItem  label="身份证正面" {...formItemLayout}>
                    {getFieldDecorator('corp_picfront', {
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
                  {getFieldDecorator('corp_picback', {
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

                <Divider orientation="left">密码设置</Divider>

                <FormItem help={this.state.help} label="密码" {...formItemLayout}>
                  <Popover
                      content={
                        <div style={{ padding: '4px 0' }}>
                            {passwordStatusMap[this.getPasswordStatus()]}
                            {this.renderPasswordProgress()}
                          <div style={{ marginTop: 10 }}>
                            请至少输入 6 个字符。请不要使用容易被猜到的密码。
                          </div>
                        </div>
                      }
                      overlayStyle={{ width: 240 }}
                      placement="right"
                      visible={this.state.visible}
                  >
                      {getFieldDecorator('password', {
                          rules: [
                              {
                                  required:true,
                                  validator: this.checkPassword,
                              },
                          ],
                      })(
                          <Input
                              size="large"
                              type="password"
                              placeholder="至少6位密码，区分大小写"
                              onBlur={()=>this.blurPassword()}
                          />
                      )}
                  </Popover>
                </FormItem>
                <FormItem label="确认密码" {...formItemLayout}>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: '请确认密码！',
                            },
                            {
                                validator: this.checkConfirm,
                            },
                        ],
                    })(<Input size="large" type="password" placeholder="确认密码" />)}
                </FormItem>

                <FormItem label="图像码" {...formItemLayout}>
                  <Row gutter={8}>
                    <Col span={16}>
                        {getFieldDecorator('verify', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入图像码！',
                                },
                            ],
                        })(<Input size="large" placeholder="图像码" />)}
                    </Col>
                    <Col span={8}>
                      <img src={this.state.verifyurl} style={{width:"100%",height:"38px",marginTop:"-3px"}} onClick={()=>this.changeVerify()}/>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem {...formNoLabelLayout}>
                    {getFieldDecorator('agree', {
                        rules: [
                            {
                                required:true,
                                message: '请勾选阅读并同意注册协议！',
                            },
                            {
                                pattern: /^(true)$/ig,
                                message: '请勾选阅读并同意注册协议！',
                            },
                        ],
                    })(<Checkbox checked={this.state.agreement } onChange={this.changeAgreement}>注册协议<Link to="/user/agreement"  target="_blank">《注册协议》</Link></Checkbox>)}
                </FormItem>

                <FormItem {...formNoLabelLayout}>
                  <Button
                    size="large"
                    loading={submitting}
                    className={styles.submit}
                    type="primary"
                    htmlType="submit"
                  >
                    注册
                  </Button>
                  <Link className={styles.login} to="/user/login" >
                    使用已有账户登录
                  </Link>
                </FormItem>
            </Form>}
        </TabPane>

        </Tabs>
        </div>
    );
  }
}
