import React, { Component } from 'react';
import { Upload, message } from 'antd';
import styles from './index.less';
import {api} from '../../../utils/config';


export default class ImagePanel extends Component {
  state = {
      left:"33.333%"
  };

    componentWillMount() {

        this.setState({
            id:this.props.id,
            url:this.props.url,
            width:this.props.width,
            height:this.props.height,
            top:this.props.top,
        })
    }

    componentDidMount(){
        let width = this.props.width, id = this.props.id;
        let parWidth = document.getElementById("r-page-1-slider-"+id).offsetWidth;
        width = width?parseInt(width):10;
        let left = width/parWidth * 100;

        this.setState({
            left:left + "%",
        })

    }

    componentWillReceiveProps(nextProps){

        let width = nextProps.width, id = nextProps.id;
        let parWidth = document.getElementById("r-page-1-slider-"+id).offsetWidth;
        width = width?parseInt(width):0;
        let left = width/parWidth * 100;

        this.setState({
            id:nextProps.id,
            url:nextProps.url,
            width:nextProps.width,
            height:nextProps.height,
            left:left + "%",
            top:nextProps.top,
        })

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

           this.props.handleClickByResize(this.props.id,l);

      }.bind(this);
      document.onmouseup = function(){
          document.onmousemove = null;
          document.onmouseup = null;
      }
  }

  render() {

    const { left } = this.state;
    const { id, handleClickByDelete, handleSetUrl } = this.props;

      let _this = this;
      //logo上传
      const props = {
          name: 'file',
          action: api.upload,
          showUploadList:false,
          onChange(info) {
              if (info.file.status !== 'uploading') {
                  console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                  // message.success(`${info.file.name} file uploaded successfully`);
                  if(info.fileList[0]['response']){
                      let path = info.fileList[0].response.path;
                      console.log(_this)
                      _this.props.handleSetUrl(_this.state.id,path);
                  }
              } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
              }
          },
      };

    return (
        <li className={styles.imgItem}>
            <div className={styles.imgLeft}>
                <img src={this.state.url} id="r-page-1-image-0" />
            </div>
            <div className={styles.imgRight}>
                <div className={styles.uploadImg}>
                    <Upload {...props}><a href="javascript:;" >上传LOGO</a></Upload>
                    <input type="file" id={"uploadlogo"+this.state.id} style={{display:"none"}} onChange={()=>this.inputOnChange("uploadlogo"+this.state.id)}/>
                </div>
                <div className={styles.resizeImg}>
                    <span>调整大小：</span>
                    <span id={"r-page-1-slider-" + this.state.id}>
                        <a href="javascript:;" style={{left: this.state.left}} onMouseDown={(e)=>this.mouseDown(e)}></a>
                    </span>
                    <a href="javascript:;" id="hide-1-image-0" onClick={() => handleClickByDelete(id)}></a>
                </div>
            </div>

        </li>
    );
  }
}
