import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './Login.less';

@connect(({ login, loading }) => ({
  login,
}))
export default class Agreement extends Component {
  state = {
  }

  render() {

    return (
      <div className={styles.main}>
        <p>协议内容</p>
        <p>协议内容</p>
        <p>协议内容</p>
        <p>协议内容</p>
        <p>协议内容</p>
      </div>
    );
  }
}
