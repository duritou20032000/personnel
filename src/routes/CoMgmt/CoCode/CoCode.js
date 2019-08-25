import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card  } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './CoCode.less';

const FormItem = Form.Item;

@connect(({ login }) => ({
    login,
}))
@Form.create()
export default class CoCode extends PureComponent {
  state = {
      way:2,
      url:"",
      intervalnum:59,
      clear:false,
  }

  componentWillMount(){

  }

  componentDidMount() {
      const { dispatch } = this.props;

      //直接获取code
      dispatch({
          type: 'login/getcode',
          payload:{
              way:this.state.way,
          }
      })

      this.countdown();
  }

  componentWillUnmount(){
      clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps){

      const { login:{ url, clear } } = nextProps;
      this.setState({
          url:url,
          clear:clear,
      })
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {

                values['cocode_back'] =  values['cocode_back']?values['cocode_back'][0].response.path:"";
                values['cocode_front'] =  values['cocode_front']?values['cocode_front'][0].response.path:"";

                this.props.dispatch({
                    type: 'cocode/saveinfo',
                    payload: {
                        ...values,
                    },
                });
            }
        });
    };

  render() {


    return (
        <PageHeaderLayout title="">
        <Card title="法人身份确认" bordered={false}>
            <div className={styles.itemCenter} style={{margin:"10px auto 30px auto"}}><img src={this.state.url} style={{margin:"5px auto"}}/></div>
            <div className={styles.itemCenter}>法人请在小程序中扫码确认.</div>
            <div className={styles.itemCenter}>须已完成实名认证.</div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
