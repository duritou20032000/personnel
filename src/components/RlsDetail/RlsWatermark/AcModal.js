import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal, Tabs, Row, Col,  Upload, message, Button, Icon  } from 'antd'
import { EditableTree } from 'components/EditableTree';
import {api} from '../../../utils/config';
import styles from "./index.less";
const FormItem = Form.Item;

const Option = Select.Option;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

let tabindex = 1;
let node = 0;

const modal = ({
  item = {},
  roles = [],
  onOk,
  dispatch,
  initTree = [],
  initList = [],
  onSelectImage,
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

          // onOk(data)
            console.log(tabindex);
        })
    }

    function callback(key) {

        tabindex = key;
    }

    const EditableProps = {
        onSelectImage:function(path){

            onSelectImage(path);
        },
        onDelImage:function(key){
            dispatch({
                type:'rlscert/removeImage',
                payload:{
                    key:key.replace("i",""),
                }
            })
        },
        addNode: function(key){
            dispatch({
                type: 'rlscert/createNode',
                payload: {
                    key:key
                },
            });
        },
        delNode: function(key){
            dispatch({
                type: 'rlscert/removeNode',
                payload: {
                    key:key
                },
            });
        },
        updateNode:function(key,value){
            dispatch({
                type: 'rlscert/updateNode',
                payload: {
                    title:value,
                    key:key
                },
            });
        },
        initTree: initTree,
    }

    const props = {

        name: 'file',
        action: api.uploadimage,
        showUploadList:false,
        beforeUpload(){
            if(!node){
                message.info("请先选择图片上传的节点");
                return false;
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                let length = info.fileList.length;
                if(info.fileList[length - 1]['response']) {

                    let path = info.fileList[length - 1].response.path;

                    dispatch({
                        type:"rlscert/createImage",
                        payload:{
                            path:path,
                            nodeid:node,
                        },
                    })

                    onSelectImage(path);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    function handleChange(value) {
        node = value;
        console.log(`selected ${value}`);
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    const options = initList.map(d => <Option key={d.id}>{d.name}</Option>)
    // console.log(getFieldsValue())

  return (
    <Modal {...modalOpts}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="图片库管理" key="1">
          <EditableTree {...EditableProps}></EditableTree>
        </TabPane>
        <TabPane tab="上传图片" key="2">
            <Row>
                <Col className={styles.formItem+" "+styles.textarea}>
                    <label>选择图片</label>
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" /> 上传图片
                        </Button>
                    </Upload>
                </Col>
            </Row>

            <Row>
                <Col className={styles.formItem+" "+styles.textarea}>
                    <label>选择节点</label>
                    <Select style={{ width: 120 }} onChange={handleChange}>
                        {options}
                    </Select>
                </Col>
            </Row>
        </TabPane>
      </Tabs>
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
