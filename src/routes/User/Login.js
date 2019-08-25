import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, Select } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { md5 } from '../../utils/md5';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const { Option } = Select;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    count: 0,
    type: 'account',
    autoLogin: true,
    way:1,
    url:"",
    intervalnum:59,
    clear:false,
  }

  componentWillReceiveProps(nextProps){

    const { login:{ url, clear } } = nextProps;
    this.setState({
        url:url,
        clear:clear,
    })
  }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

  onTabChange = (type) => {

    if(type=='mobile'){
      this.props.dispatch({
          type: 'login/getcode',
          payload:{
            way:this.state.way,
          }
      })
        this.countdown();
    }else{
        clearInterval(this.interval);
    }

    this.setState({ type });
  }

  countdown = () =>{
      clearInterval(this.interval);
      let count = this.state.intervalnum,_this = this;
      this.setState({ count });

      this.interval = setInterval(() => {
          count -= 1;
          this.props.dispatch({
              type: 'login/checkcode',
              payload:{
                  way:_this.state.way,
              }
          })
          this.setState({ count });
          let clear = _this.state.clear;
          if (count === 0 || clear) {
              clearInterval(this.interval);
          }
      }, 1000);
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;

    var password = values.password;
    values.password = md5(password);

    //登录方式
    values['way'] = this.state.way;

    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  loginWay = (e) => {

    this.setState({
        way:e,
    })

    if(this.state.type=='mobile'){
        this.props.dispatch({
            type: 'login/getcode',
            payload:{
                way:e,
            }
        })

        this.countdown();
    }else{
        clearInterval(this.interval);
    }
 }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="账户登陆">
            {
              login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误')
            }
              {this.state.way==1 && <UserName name="userName" placeholder="账户" />}
              {this.state.way==1 && <Password name="password" placeholder="密码" />}

              {this.state.way==2 && <UserName name="coname" placeholder="企业名" />}
              {this.state.way==2 && <Password name="cocode" placeholder="统一社会信用代码" />}
              {this.state.way==2 && <Password name="password" placeholder="密码" />}
            <Select defaultValue="1" size="large" style={{marginBottom:20}} onChange={(e)=>this.loginWay(e)}>
              <Option value="1">个人用户登录</Option>
              <Option value="2">企业用户登录</Option>
            </Select>
            <div>
              <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
              <a style={{ float: 'right' }} href="">忘记密码</a>
            </div>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}>
                {/*其他登录方式*/}
                {/*<Icon className={styles.icon} type="alipay-circle" />*/}
                {/*<Icon className={styles.icon} type="taobao-circle" />*/}
                {/*<Icon className={styles.icon} type="weibo-circle" />*/}
              <Link className={styles.register} to="/user/register">注册账户</Link>
            </div>
          </Tab>
          <Tab key="mobile" tab="二维码登录">
            <div className={styles.itemCenter} style={{margin:"10px auto 30px auto"}}><img src={this.state.url} style={{margin:"5px auto"}}/></div>
            <Select defaultValue="1" size="large" style={{marginBottom:20}} onChange={(e)=>this.loginWay(e)}>
              <Option value="1">个人用户登录</Option>
              <Option value="2">企业用户登录</Option>
            </Select>
          </Tab>
        </Login>
      </div>
    );
  }
}
