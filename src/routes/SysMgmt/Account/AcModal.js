import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal } from 'antd'
import { md5 } from '../../../utils/md5'

const FormItem = Form.Item;

const Option = Select.Option;

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
  roles = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
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

      // 加密密码
      let pwd = md5(data.password)
      data.password = pwd

      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const options = roles.map(d => <Option key={d.id}>{d.name}</Option>)
  // console.log(getFieldsValue())

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" hasFeedback {...formItemLayout} >
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
            rules: [
              {
                required: true,
                pattern: /^\S{5,}$/,
                message: '请输入至少5位任意字符组成密码',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label="角色" hasFeedback {...formItemLayout}>
          {getFieldDecorator('roledesc', {
            initialValue: item.role ? item.role.toString() : '',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a person"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {options}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  roles: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
