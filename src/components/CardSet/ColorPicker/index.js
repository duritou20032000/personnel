import React, { Component } from 'react';

import styles from './index.less';


export default class ColorPicker extends Component {
  state = {
    color:[
        {id:1,color:"#8B0016"},
        {id:2,color:"#8E1E20"},
        {id:3,color:"#945305"},
        {id:4,color:"#976D00"},
        {id:5,color:"#9C9900"},
        {id:6,color:"#367517"},
        {id:7,color:"#006241"},
        {id:8,color:"#00676B"},
        {id:9,color:"#103667"},
        {id:10,color:"#211551"},
        {id:11,color:"#38044B"},
        {id:12,color:"#64004B"},
        {id:13,color:"#000000"},

        {id:14,color:"#B2001F"},
        {id:15,color:"#B6292B"},
        {id:16,color:"#BD6B09"},
        {id:17,color:"#C18C00"},
        {id:18,color:"#C7C300"},
        {id:19,color:"#489620"},
        {id:20,color:"#007F54"},
        {id:21,color:"#008489"},
        {id:22,color:"#184785"},
        {id:23,color:"#2D1E69"},
        {id:24,color:"#490761"},
        {id:25,color:"#780062"},
        {id:26,color:"#707070"},

        {id:27,color:"#C50023"},
        {id:28,color:"#B6292B"},
        {id:29,color:"#D0770B"},
        {id:30,color:"#D59B00"},
        {id:31,color:"#DCD800"},
        {id:32,color:"#50A625"},
        {id:33,color:"#008C5E"},
        {id:34,color:"#009298"},
        {id:35,color:"#1B4F93"},
        {id:36,color:"#322275"},
        {id:37,color:"#52096C"},
        {id:38,color:"#8F006D"},
        {id:39,color:"#898989"},

        {id:40,color:"#DF0029"},
        {id:41,color:"#E33539"},
        {id:42,color:"#EC870E"},
        {id:43,color:"#F1AF00"},
        {id:44,color:"#F9F400"},
        {id:45,color:"#5BBD2B"},
        {id:46,color:"#00A06B"},
        {id:47,color:"#00A6AD"},
        {id:48,color:"#205AA7"},
        {id:49,color:"#3A2885"},
        {id:50,color:"#5D0C7B"},
        {id:51,color:"#A2007C"},
        {id:53,color:"#A0A0A0"},

        {id:54,color:"#E54646"},
        {id:55,color:"#EB7153"},
        {id:56,color:"#F09C42"},
        {id:57,color:"#F3C246"},
        {id:58,color:"#FCF54C"},
        {id:59,color:"#83C75D"},
        {id:60,color:"#00AE72"},
        {id:61,color:"#00B2BF"},
        {id:62,color:"#426EB4"},
        {id:63,color:"#511F90"},
        {id:64,color:"#79378B"},
        {id:65,color:"#AF4A92"},
        {id:66,color:"#B7B7B7"},

        {id:67,color:"#EE7C6B"},
        {id:68,color:"#F19373"},
        {id:69,color:"#F5B16D"},
        {id:70,color:"#F9CC76"},
        {id:71,color:"#FEF889"},
        {id:72,color:"#AFD788"},
        {id:73,color:"#67BF7F"},
        {id:74,color:"#6EC3C9"},
        {id:75,color:"#7388C1"},
        {id:76,color:"#635BA2"},
        {id:77,color:"#8C63A4"},
        {id:78,color:"#C57CAC"},
        {id:79,color:"#C2C2C2"},

        {id:80,color:"#F5A89A"},
        {id:81,color:"#F6B297"},
        {id:82,color:"#FACE9C"},
        {id:83,color:"#FCE0A6"},
        {id:84,color:"#FFFAB3"},
        {id:85,color:"#C8E2B1"},
        {id:86,color:"#98D0B9"},
        {id:87,color:"#99D1D3"},
        {id:88,color:"#94AAD6"},
        {id:89,color:"#8273B0"},
        {id:90,color:"#AA87B8"},
        {id:91,color:"#D2A6C7"},
        {id:92,color:"#D7D7D7"},

        {id:93,color:"#FCDAD5"},
        {id:94,color:"#FCD9C4"},
        {id:95,color:"#FDE2CA"},
        {id:96,color:"#FEEBD0"},
        {id:97,color:"#FFFBD1"},
        {id:98,color:"#E6F1D8"},
        {id:99,color:"#C9E4D6"},
        {id:100,color:"#CAE5E8"},
        {id:101,color:"#BFCAE6"},
        {id:102,color:"#A095C4"},
        {id:103,color:"#C9B5D4"},
        {id:104,color:"#E8D3E3"},
        {id:105,color:"#FFFFFF"},
    ],
    colorval:"#000000",
    id:0,
    display:"block",
  };

  componentWillMount() {

    this.setState({
        id:this.props.id,
        display:this.props.show,
    })
  }

  componentWillReceiveProps(nextProps){

      this.setState({
          id:nextProps.id,
          display:nextProps.show,
      })
  }

  componentDidMount(){

  }

  componentWillUnmount() {

  }

    /**
     * 选择验颜色
     * @param color
     */
  chooseColor(color){

      //设置text的color值
      document.getElementById("colorPickerText").value = color;
      this.setState({
          colorval:color,
      })
  }

  handleOnChange(){

      let color = document.getElementById("colorPickerText").value;
      this.setState({
          colorval:color,
      })
  }

  handleClose(){
      // this.setState({
      //     display:"none",
      // })
      const { handleClose } = this.props;

      handleClose();
  }

  handleOk(){

      const { handleOk, handleClose } = this.props;
      let id = this.state.id,
          color = this.state.colorval;

      handleOk(id,color);
      //关闭窗口
      handleClose();
  }

  render() {

      const colors = this.state.color.map(item => <div key={item.id} style={{backgroundColor:item.color}} onClick={()=>this.chooseColor(item.color)}></div>)

    return (
        <div style={{display:this.state.display}}>
            <div className={styles.pickerBg}>
            </div>
            <div className={styles.pickerBody}>
                <div className={styles.pickerTitle}>
                    <div>颜色选择器</div>
                    <div onClick={()=>this.handleClose()}>x</div>
                </div>
                <div className={styles.pickerPanel}>
                    {colors}
                </div>
                <div className={styles.pickerShowPanel}>
                    <div id="showcolor" style={{backgroundColor:this.state.colorval}}></div>
                    <input type="text" defaultValue={this.state.colorval} id="colorPickerText" onChange={()=>this.handleOnChange()}/>
                </div>
                <div className={styles.pickerBtnPanel}>
                    <div onClick={()=>this.handleOk()}>确定</div>
                    <div onClick={()=>this.handleClose()}>关闭</div>
                </div>
            </div>
        </div>
    );
  }
}
