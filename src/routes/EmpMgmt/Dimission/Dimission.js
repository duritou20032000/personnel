import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Table,  Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './Dimission.less';

const FormItem = Form.Item;

@connect(({ dimission, loading }) => ({
  dimission,
  loading: loading.models.dimission,
}))
@Form.create()
export default class Dimission extends PureComponent {
    state = {
        expandForm: false,
        selectedRows: [],
        selectedRowKeys:[],
        formValues: {},
        modalType: "create",
        currentItem: {},
        page:1,               //页码
        results:10,           //每页行数
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'dimission/fetch',
            payload:{
                state:2,
            }
        });

        dispatch({
            type: 'dimission/fetchOption',
        });

    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'dimission/fetch',
            payload: {
                state:2
            },
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

            //查询离职员工
            values['state'] = 2;

            dispatch({
                type: 'dimission/fetch',
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
            type: 'dimission/showModal',
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
        //查询离职员工
        param['state'] = 2;

        dispatch({
            type: 'dimission/fetch',
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
            </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { dimission: { data, modalVisible, po, se, pr, de }, loading, dispatch } = this.props;
        const { selectedRows, modalType, currentItem } = this.state;
        const sex = ["男","女","未知"];
        const state = ["在职","离职","休假"];
        const political = ["群众","党员"];
        const married = ["未婚","已婚","离异","丧偶"];
        const education = ["专科及以下","本科","硕士研究生","博士研究生"];

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
                dataIndex: 'dimission_time',
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
            }
        ];

        const pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            ...data.pagination,
        }

        return (
            <PageHeaderLayout title="">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>

                        <Table
                            loading={loading}
                            dataSource={data.list}
                            columns={columns}
                            scroll={{ x: 2820}}
                            pagination={pagination}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
