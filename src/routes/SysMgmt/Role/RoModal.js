import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal } from 'antd'
import { MenuTree }  from 'components/MenuTree';

const FormItem = Form.Item;

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
  tree = [],
  onOk,
  state,
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

      if (state != []) {
          data.privilege = state
      }

      onOk(data)
    })
  }

    const privilege = item.privilege;
    for (let temp in privilege) {
        privilege[temp] = privilege[temp].toString()
    }

    const treeProps = {
        initData: privilege,
        gData: tree,
        getData: (value) => {
            state = value
        },
    }

    const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="角色名" hasFeedback {...formItemLayout} >
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="菜单权限" {...formItemLayout}>
            {getFieldDecorator('privilege', {
                initialValue: item.privilege,
                rules: [
                ],
            })(<MenuTree {...treeProps} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  state: PropTypes.array,
  tree: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
