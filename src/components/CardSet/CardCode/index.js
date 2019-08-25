import React, { Component } from 'react';

import styles from './index.less';
import { CodePanel } from "../../../components/CardSet";

export default class CardCode extends Component {
  state = {
      image:[
      ],
      imageid:0,
  };

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
      const {count,handleAddLogo,handleResizeLogo,handleDelLogo} = this.props;
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
          }
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
      const imagepanel = this.state.image.map(item=><CodePanel key = {item.id} id = {item.id} {...imagePanelProps}/>);

      return (
          <div className={styles.logoItems}>
              <ul>
                  {imagepanel}
              </ul>
              {this.state.image.length<1 && <a href="javascript:;" className={styles.addLogoButton} onClick={() => handleClickByAdd()}>添加二维码</a>}
          </div>
      );
  }
}
