import React, { PureComponent } from 'react';
import { Slider, Icon } from 'antd';
import styles from "./index.less";

export default class SliderInput extends PureComponent {

    state = {
        open:false,
        id:Math.random(),
        left:0,
        top:0,
        value:0,
        min:0,
        max:60,
        step:1,
    }

    componentDidMount(){

        let _this = this;
        window.onscroll = function(){

            _this.resetBounding();
        }

    }

    componentWillMount(){

        const { max, min, value, step } = this.props;

        this.setState({
            min:min?min:0,
            max:max?max:60,
            value:value?value:0,
            step:step?step:1,
        })
    }

    resetBounding = () => {
        //重置下拉框参数
        let dom = document.getElementById(this.state.id);
        if(dom){
            let left = dom.getBoundingClientRect().left,
                top = dom.getBoundingClientRect().top,
                width = dom.getBoundingClientRect().width,
                height = dom.getBoundingClientRect().height;

            this.setState({
                left:left,
                top:top+height,
                width:width,
            })
        }
    }

    openSlider = () => {

        this.resetBounding();

        this.setState({
            open:!this.state.open,
        })


    }

    render(){

        const { open, left, top, width, value, min, max, step } = this.state;

        const onChange = (e) => {

            this.setState({
                value:e,
            })

            if(typeof this.props.onHandleChange == "function"){

                this.props.onHandleChange(e);
            }
        }

        const foldSlider = () => {

            //折叠下拉框
            if(this.state.open){
                this.setState({
                    open:false,
                })
            }
        }

        return(
            <div onMouseLeave={foldSlider}>
                <div className={styles.sliderInput} onClick={this.openSlider} id={this.state.id}>
                    <div>
                        {value}
                    </div>
                    <Icon type="down" className={open?styles.sliderOpen:''}></Icon>
                </div>
                <div  className={open?styles.sliderDropdownOpen:styles.sliderDropdownClose} style={{top:top,left:left,width:width}}>
                    <Slider vertical defaultValue={value} min={min} max={max}  step={step} onChange={onChange} />
                </div>
            </div>
        )
    }
}