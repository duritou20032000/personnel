import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Popconfirm, message, Divider, Modal } from 'antd';
import StandardTable  from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RoModal from './RoModal'

import styles from './Role.less';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class Role extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    selectedRowKeys:[],
    formValues: {},
    modalType: "create",
    currentItem: {},
    page:1,
    pageSize:10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
      dispatch({
          type: 'role/fetch',
      });

      //查询角色
      dispatch({
          type: 'role/fetchTree',
      })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetch',
      payload: {},
    });
  }

  handleMultiDelete = () => {

    //批量删除
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    if (!selectedRowKeys) return;

    dispatch({
      type: 'role/remove',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: [],
        });
      },
    });

  }

  handleSelectRows = (rows,keys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: keys,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      values["page"] = this.state.page;
      values["pageSize"] = this.state.results;

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  }

    handleTableChange = (pagination, filters, sorter) => {

        const { dispatch } = this.props;

        this.setState({
            page: pagination.current,
            results:pagination.pageSize,
        });

        let pager = {
            page:pagination.current,
            pageSize:pagination.pageSize,
        }

        let param = {...pager,...filters};

        dispatch({
            type: 'role/fetch',
            payload: param,
        });
    }

  handleModalVisible = (flag,record) => {

      this.setState({
          modalType:flag,
          currentItem:record,
      })

      this.props.dispatch({
          type: 'role/showModal',
      })
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'role/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  handleDelete = (id) =>{

      const { dispatch } = this.props;

      confirm({
          title: '你确定要删除吗?',
          okText:'确定',
          cancelText:'取消',
          onOk () {
              dispatch({
                  type: 'role/remove',
                  payload: {
                      id:id
                  },
              })
          },
      })
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('filter')(
                <Input placeholder="请输入角色名查询" />
              )}
            </FormItem>
          </Col>
          <Col md={18} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible("create",{})} style={{float:"right"}}>
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { role: { data, tree, modalVisible }, loading, dispatch } = this.props;
    const { selectedRows, modalType, currentItem } = this.state;

    const dropdown = (record) =>{

        return (
            <Menu>
                <Menu.Item>
                    <a href="javascript:;" onClick={() => this.handleModalVisible("update",record)}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>删除</a>
                </Menu.Item>
            </Menu>
        );
    }

    const columns = [
        {
            title: '角色名',
            dataIndex: 'name',
            width:100,
        },
        {
            title: '已授予权限',
            dataIndex: 'privilege_desc',
        },
        {
            title: '创建时间',
            dataIndex: 'create',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            width:180,
        },
        {
            title: '操作',
            render: (text,record) => record.type==2 && (
                <Fragment>
                  <a href="javascript:;" onClick={() => this.handleModalVisible("update",record)}>编辑</a>
                  <Divider type="vertical" />
                  <Dropdown overlay={dropdown(record)}>
                    <a>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </Fragment>
            ),
            width:125,
        },
    ];

      const modalProps = {
        item: modalType === 'create' ? {} : currentItem,
        tree: tree,
        visible: modalVisible,
        maskClosable: false,
        state: [],
        title: `${modalType === 'create' ? '创建角色' : '编辑角色'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
            dispatch({
                type: `role/setprivilege`,
                payload: data,
            })
        },
        onCancel () {
            dispatch({
                type: 'role/hideModal',
            })
        },
      }

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              {
                selectedRows.length > 0 && (
                   <Popconfirm title={'你确定要删除这些项目吗?'} placement="right" onConfirm={this.handleMultiDelete}>
                       <span><Button style={{ marginLeft: 8 }}>批量删除</Button></span>
                   </Popconfirm>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
          {modalVisible && <RoModal {...modalProps}/>}
      </PageHeaderLayout>
    );
  }
}
