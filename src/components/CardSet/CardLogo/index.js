import React, { Component } from 'react';

import styles from './index.less';
import { ImagePanel } from "../../../components/CardSet";


export default class CardLogo extends Component {
  state = {
    image:[
    ],
    imageid:0,
  };

  componentDidMount() {

  }

  componentWillMount() {
      this.init(this.props);
  }

  componentWillReceiveProps(nextProps){

      this.init(nextProps);
  }

  componentWillUnmount() {

  }

  init(props){
      const { init, reverse} = props;

      let image = [],imageid = 0;
      for(var temp in init){

          imageid = imageid < init[temp]['id'] ? init[temp]['id'] : imageid;
          if(init[temp]['reverse'] == reverse){
              //分正反面
              image.push({
                  id:init[temp]['id'],
                  url:init[temp]['url'],
                  width:init[temp]['width'],
                  height:init[temp]['height'],
                  left:init[temp]['left'],
                  top:init[temp]['top'],
                  focus:0,
              });
          }
      }

      this.setState({
          imageid:imageid,
          image:image,
      });
  }

  render() {

    const {handleAddLogo,handleResizeLogo,handleDelLogo,handleSetUrl} = this.props;
    /**
     * 删除一个logo
     */
    const imagePanelProps = {
      handleClickByDelete:function(index){
        //删除面板
        var image = this.state.image;
        image = image.filter(item => item.id != index);
        this.setState({
            image:image
        })

        handleDelLogo(index);
      }.bind(this),

      handleClickByResize:function(index, size){

          handleResizeLogo(index, size);
      },
        handleSetUrl:handleSetUrl
    }

    /**
     * 添加一个Logo
     */
    const handleClickByAdd = () =>{
      let image = this.state.image;
      let index = Math.random();

      //添加数据
      image.push({
          id:index,
          url:"http://www.aliyin.com/Upload/Design/Logos/Originals/201803/201803261020032599.png",
          width:"20px",
      });

      handleAddLogo(index);

      this.setState({
          imageid:index,
          image:image,
      });

    }

    const imagepanel = this.state.image.map(item=><ImagePanel key = {item.id} id = {item.id} url = {item.url} width = {item.width} {...imagePanelProps}/>);

    return (
      <div className={styles.logoItems}>
        <ul>
            {imagepanel}
        </ul>
          {this.state.image.length<1 && <a href="javascript:;" className={styles.addLogoButton} onClick={() => handleClickByAdd()}>添加LOGO</a>}
      </div>
    );
  }
}
