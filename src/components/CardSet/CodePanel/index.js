import React, { Component } from 'react';

import styles from './index.less';

export default class CodePanel extends Component {
  state = {
      left:"33.333%"
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  mouseDown(event){
      var   target = event.target,
            parTarget = target.parentElement,
            disX = event.pageX - target.offsetLeft,
            parDixX = event.pageX - parTarget.offsetLeft,
            w = target.offsetWidth,
            parW = parTarget.offsetWidth;

      document.onmousemove = function(event){
            event.preventDefault();
            var l = event.pageX - disX;
            if(l<0){
                l = 0;
            }
            if(l>parW){
                l = parW;
            }

            var left = l/parW * 100;

            this.setState({
              left: left + "%"
            })

           this.props.handleClickByResize(this.props.id,l * 2);

      }.bind(this);
      document.onmouseup = function(){
          document.onmousemove = null;
          document.onmouseup = null;
      }
  }

  render() {

    const { left } = this.state;
    const { id, handleClickByDelete } = this.props;

    return (
        <li className={styles.imgItem}>
            <div className={styles.imgLeft}>
                <img src="../../../../image/code.png" id="r-page-1-image-0" />
            </div>
            <div className={styles.imgRight}>
                <div className={styles.uploadImg}></div>
                <div className={styles.resizeImg}>
                    <span>调整大小：</span>
                    <span id="r-page-1-slider-0">
                        <a href="javascript:;" style={{left: this.state.left}} onMouseDown={(e)=>this.mouseDown(e)}></a>
                    </span>
                    <a href="javascript:;" id="hide-1-image-0" onClick={() => handleClickByDelete(id)}></a>
                </div>
            </div>

        </li>
    );
  }
}
