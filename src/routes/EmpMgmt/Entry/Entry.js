import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, Popconfirm, Divider, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable  from '../../../components/StandardTable';
import EntryModal from './EntryModal';
import styles from './Entry.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({ entry, loading }) => ({
  entry,
  loading: loading.models.entry,
}))
@Form.create()
export default class Entry extends PureComponent {
  state = {
      expandForm: false,
      selectedRows: [],
      selectedRowKeys:[],
      formValues: {},
      modalType: "create",
      currentItem: {},
      page:1,               //页码
      results:10,           //每页行数
      empdetail:{
          awardinfo:[],
          baseinfo:[],
          workinfo:[],
      },
      path:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'entry/fetch',
    });

      dispatch({
          type: 'entry/fetchOption',
      });

  }

  componentWillReceiveProps(nextProps){

      this.setState({
          empdetail:nextProps.empdetail,
          codeurl:nextProps.codeurl,
          codeparam:nextProps.codeparam,
      })
  }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'entry/fetch',
            payload: {},
        });
    }

    handleMultiDelete = () => {

        //批量删除
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;

        if (!selectedRowKeys) return;

        dispatch({
            type: 'entry/remove',
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

    handleMultiLeave = () => {

        //批量删除
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;

        if (!selectedRowKeys) return;

        dispatch({
            type: 'entry/leave',
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
                type: 'entry/fetch',
                payload: values,
            });
        });
    }

    handleModalVisible = (flag,record) => {

        this.setState({
            modalType:flag,
            currentItem:record,
        })

        this.props.dispatch({
            type: 'entry/fetchDetail',
            payload:{
                id:record.id,
                flag:flag,
            }
        })

    }

    handleDelete = (id) =>{

        const { dispatch } = this.props;

        confirm({
            title: '你确定要删除吗?',
            okText:'确定',
            cancelText:'取消',
            onOk () {
                dispatch({
                    type: 'entry/remove',
                    payload: {
                        id:id
                    },
                })
            },
        })
    }

    handleLeave = (id) =>{

        const { dispatch } = this.props;

        confirm({
            title: '你确定要设置离职吗?',
            okText:'确定',
            cancelText:'取消',
            onOk () {
                dispatch({
                    type: 'entry/leave',
                    payload: {
                        id:id
                    },
                })
            },
        })
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
            type: 'entry/fetch',
            payload: param,
        });
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible("create",{})} style={{float:"right"}}>
                入职
              </Button>
            </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { entry: { data, modalVisible, po, se, pr, de,empdetail, }, loading, dispatch } = this.props;
        const { selectedRows, modalType, currentItem, path } = this.state;
        const sex = ["男","女","未知"];
        const state = ["在职","离职","休假"];
        const political = ["群众","党员"];
        const married = ["未婚","已婚","离异","丧偶"];
        const education = ["专科及以下","本科","硕士研究生","博士研究生"];
        var _this = this;

        const dropdown = (record) =>{

            return (
                <Menu>
                    <Menu.Item>
                        <a href="javascript:;" onClick={() => this.handleModalVisible("update",record)}>编辑</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a href="javascript:;" onClick={() => this.handleLeave(record.id)}>离职</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>删除</a>
                    </Menu.Item>
                </Menu>
            );
        }

        const columns = [
            {
              title:'员工编号',
              dataIndex:'emp_no',
               width: 150,
              fixed: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                width: 100,
                fixed: 'left',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                width: 100,
                filters: [
                    { text: '男', value: '1' },
                    { text: '女', value: '2' },
                ],
                render:val => <span>{sex[val-1]}</span>,
            },
            {
                title: '身份证号',
                dataIndex: 'idno',
                width: 250,
            },
            {
                title: '政治面貌',
                dataIndex: 'political',
                width: 120,
                filters: [
                    { text: '群众', value: '1' },
                    { text: '党员', value: '2' },
                ],
                render:val => <span>{political[val-1]}</span>,
            },
            {
                title: '婚姻状况',
                dataIndex: 'married',
                width: 120,
                filters: [
                    { text: '未婚', value: '1' },
                    { text: '已婚', value: '2' },
                    { text: '离异', value: '3' },
                    { text: '丧偶', value: '4' },
                ],
                render:val => <span>{married[val-1]}</span>,
            },
            {
                title: '学历',
                dataIndex: 'education',
                width: 130,
                filters: [
                    { text: '专科及以下', value: '1' },
                    { text: '本科', value: '2' },
                    { text: '硕士研究生', value: '3' },
                    { text: '博士研究生', value: '4' },
                ],
                render:val => <span>{education[val-1]}</span>,
            },
            {
                title: '座机',
                dataIndex: 'tel',
                width: 150,
            },
            {
                title: '手机',
                dataIndex: 'phone',
                width: 150,
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                width: 250,
            },
            {
                title: '部门',
                dataIndex: 'org_id',
                width: 100,
                filters:de,
                render:val => {

                    let data = de.filter(item => item.value == val);
                    let value = data.length > 0 ? data[0]['text'] : "";

                    return <span>{value}</span>
                }
            },
            {
                title: '职位',
                dataIndex: 'position',
                width: 100,
            },
            {
                title: '职称',
                dataIndex: 'prof_id',
                width: 100,
                filters:po,
                render:val => {

                    let data = po.filter(item => item.value == val);
                    let value = data.length > 0 ? data[0]['text'] : "";

                    return <span>{value}</span>
                }
            },
            {
                title: '权限',
                dataIndex: 'priv_id',
                width: 150,
                filters:pr,
                render:val => {

                    let data = pr.filter(item=>item.value==val);
                    let value = data.length>0?data[0]['text']:"";

                    return <span>{value}</span>
                }
            },
            {
                title: '序列',
                dataIndex: 'seq_id',
                width: 100,
                filters:se,
                render:val => {

                    let data = se.filter(item => item.value == val);
                    let value = data.length > 0 ? data[0]['text'] : "";

                    return <span>{value}</span>
                }
            },
            {
                title: '在职状态',
                dataIndex: 'state',
                width: 100,
                render:val => <span>{state[val-1]}</span>
            },
            {
                title: '入职时间',
                dataIndex: 'entry_time',
                width: 200,
                render: val => <span>{val?moment(val).format('YYYY-MM-DD HH:mm:ss'):""}</span>,
            },
            {
                title: '工作年限',
                dataIndex: 'years',
                width: 100,
                render: val => <span>{val}年</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'create',
                width: 200,
                render: val => <span>{val?moment(val).format('YYYY-MM-DD HH:mm:ss'):""}</span>,
            },
            {
                title: '操作',
                width: 150,
                fixed: 'right',
                render: (text,record) => (
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
            },
        ];

        const modalProps = {
            item: modalType === 'create' ? {} : currentItem,
            visible: modalVisible,
            maskClosable: false,
            title: `${modalType === 'create' ? '员工入职' : '编辑员工信息'}`,
            wrapClassName: 'vertical-center-modal',
            po,
            se,
            pr,
            de,
            awardinfo:empdetail.awardinfo || [],
            baseinfo:empdetail.baseinfo || [],
            workinfo:empdetail.workinfo || [],
            path:path,
            onOk (data) {
                dispatch({
                    type: `entry/saveEmpDetail`,
                    payload: data,
                })
            },
            onCancel () {
                dispatch({
                    type: 'entry/hideModal',
                })
            },
            getUploadImage(path){

                console.log(path);
                _this.setState({
                    path:path,
                })
            }
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
                                    <div>
                                        <Popconfirm title={'你确定要删除这些员工吗?'} placement="right" onConfirm={this.handleMultiDelete}>
                                            <span><Button style={{ marginLeft: 8 }}>批量删除</Button></span>
                                        </Popconfirm>
                                        <Popconfirm title={'你确定要将这些员工设置成离职吗?'} placement="right" onConfirm={this.handleMultiLeave}>
                                            <span><Button style={{ marginLeft: 8 }}>批量离职</Button></span>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={columns}
                            onSelectRow={this.handleSelectRows}
                            scroll={{ x: 2820}}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
                {modalVisible && <EntryModal {...modalProps}/>}
            </PageHeaderLayout>
        );
  }
}
