import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { CardLogo, CardCode, CardText, ColorPicker } from 'components/CardSet';
import CardTemplateSet from 'components/CardSet/CardTemplateSet';

@connect(({ card }) => ({
    card,
}))
export default class CardSet extends PureComponent {
  state = {
    data:{},
    type:1,
  }

  componentWillMount(){

  }

  componentDidMount() {

      const { dispatch } = this.props;
      dispatch({
          type: 'card/fetch',
      });

  }

  componentWillReceiveProps(nextProps){

      let data = nextProps.card.data;

      if(JSON.stringify(data)!="{}"){
          //初始化数据
          let text = data.text,
              logo = data.logo,
              code = data.code,
              frontimage = data.frontimage,
              backimage = data.backimage,
              id = data.id;

          text = text?JSON.parse(text):"";
          logo = logo?JSON.parse(logo):"";
          code = code?JSON.parse(code):"";
          frontimage = frontimage?frontimage:"";
          backimage = backimage?backimage:"";
          id = id?id:0;

          this.setState({
              data:{
                  logo:logo,
                  text:text,
                  code:code,
                  frontimage:frontimage,
                  backimage:backimage,
              },
              id:id,
          })
      }

  }


  render() {

      const { data, type, id } = this.state;
      let _this = this;

      const cardtemplateProps = {
          data:data,
          type:type,
          saveTemplate:function(data){
              const { dispatch } = _this.props;

              data['type'] = 1;
              data['id'] = id;
              data['title'] = "";

              dispatch({
                  type: 'card/saveInfo',
                  payload:data
              });
          }
      }
    return (
        <CardTemplateSet {...cardtemplateProps}></CardTemplateSet>
    );
  }
}
