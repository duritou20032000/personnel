import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'antd'
import { EditEmpDetail } from '../../../components/CardSet/index'
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  dispatch,
  ...modalProps
}) => {

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      //补充数据
      let orgemp_id = 0;
      if(modalProps.workinfo){

          data['orgemp_id'] = modalProps.workinfo['orgemp_id'];
      }

      if(modalProps.baseinfo){

          data['id'] = modalProps.baseinfo['id'];
          data['portrait'] = modalProps.path?modalProps.path:modalProps.imageUrl;
          data['entry_time'] = moment(data['entry_time']).format('YYYY-MM-DD');
      }

      if(modalProps.award){
          //转换award格式
          let award = modalProps.award;

          for(let temp in award){
              award[temp]['content'] = data['award'][temp];
          }

          data['award'] = award;
      }

      console.log(data);
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    bodyStyle:{padding:"0px"}
  }

    const empDetailProps = {
        dispatch,
        ...modalOpts,
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
        },
    }

    return (
    <Modal {...modalOpts}>
       <EditEmpDetail {...empDetailProps}/>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
