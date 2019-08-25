import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Popconfirm, message,Modal, Table } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CompanyDetail from './CompanyDetail'

import styles from './Company.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
export default class Company extends PureComponent {
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
      type: 'company/fetch',
    });

  }



  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'company/fetch',
      payload: {},
    });
  }

  handleMultiDelete = () => {

    //批量删除
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    if (!selectedRowKeys) return;

    dispatch({
      type: 'company/remove',
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
        type: 'company/fetch',
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
            type: 'company/fetch',
            payload: param,
        });
    }

  handleModalVisible = (flag,record) => {

      this.setState({
          modalType:flag,
          currentItem:record,
      })

      this.props.dispatch({
          type: 'company/showModal',
      })
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'company/add',
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
                  type: 'company/remove',
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
                <Input placeholder="请输入姓名查询" />
              )}
            </FormItem>
          </Col>
          <Col md={18} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { company: { data, modalVisible }, loading, dispatch } = this.props;
    const { selectedRows, modalType, currentItem } = this.state;

    const columns = [
        {
            title: '企业名称',
            dataIndex: 'name',
            width:200,
        },
        {
            title: '社会信用代码',
            dataIndex: 'code',
            width:200,
        },
        {
            title: '法人名称',
            dataIndex: 'corp',
            width:100,
        },
        {
            title: '账号状态',
            dataIndex: 'state',
            render:val => <span style={{color:val==1?"green":"red"}}>{val==1?"通过":"未通过"}</span>,
            width:100,
        },
        {
            title: '创建时间',
            dataIndex: 'create',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            width:200,
        },
        {
            title: '操作',
            render: (text,record) => (
                <Fragment>
                  <a href="javascript:;" onClick={() => this.handleModalVisible("update",record)}>查看</a>
                </Fragment>
            ),
            width:100,
        },
    ];

      const modalProps = {
        item: currentItem,
        onOk (data) {
            dispatch({
                type: `company/approve`,
                payload: data,
            })
        },
        onCancel () {
            dispatch({
                type: 'company/hideModal',
            })
        },
    }

    return (
      <PageHeaderLayout title="">
          {!modalVisible && <Card bordered={false}>
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
              <Table
              loading={loading}
              dataSource={data.list}
              columns={columns}
              scroll={{ x: 900}}
              pagination={data.pagination}
              onChange={this.handleTableChange}
              />
          </div>
        </Card>}

          {modalVisible && <CompanyDetail {...modalProps}/>}
      </PageHeaderLayout>
    );
  }
}
