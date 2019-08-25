import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Table, Button, Input } from 'antd';
import { RlsAutDetail } from '../../../components/RlsDetail';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './AuditAut.less';

const FormItem = Form.Item;

@connect(({ auditaut, loading }) => ({
  auditaut,
  loading: loading.models.auditaut,
}))
@Form.create()
export default class AuditAut extends PureComponent {
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
            type: 'auditaut/fetch',
        });
    }



    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'auditaut/fetch',
            payload: {},
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
                type: 'auditaut/fetch',
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
            type: 'auditaut/fetch',
            payload: param,
        });
    }

    handleModalVisible = (flag,record) => {

        this.setState({
            modalType:flag,
            currentItem:record,
        })

        this.props.dispatch({
            type: 'auditaut/showModal',
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
                                <Input placeholder="请输入类别查询" />
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
        const { auditaut: { data, modalVisible }, loading, dispatch } = this.props;
        const { selectedRows, modalType, currentItem } = this.state;


        const columns = [
            {
                title:'序号',
                dataIndex:'id',
            },
            {
                title: '类别',
                dataIndex: 'class',
            },
            {
                title: '姓名',
                dataIndex: 'username',
            },
            {
                title: '有效时间',
                dataIndex: 'vtime',
            },
            {
                title: '电子签名',
                dataIndex: 'sign',
                width: 200,
                render:val => <span className={styles.cellnowrap}>{val}</span>,
            },
            {
                title: '审核状态',
                dataIndex: 'pass',
                filters: [
                    { text: '通过', value: '1' },
                    { text: '未通过', value: '2' },
                    { text: '待审核', value: '3' },
                ],
                render:val => <span style={{color:val!=3?val!=1?"red":"green":"#40a9ff"}}>{val!=3?val!=1?"未通过":"通过":"待审核"}</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'create',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '操作',
                render: (text,record) => (
                    <Fragment>
                        <a href="javascript:;" onClick={() => this.handleModalVisible("update",record)}>审核</a>
                    </Fragment>
                ),
            },
        ];

        const modalProps = {
            curritem: currentItem,
            audit:true,
            onOk (data) {
                dispatch({
                    type: `auditaut/approveinfo`,
                    payload: data,
                })
            },
            onCancel () {
                dispatch({
                    type: 'auditaut/hideModal',
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

                        <Table
                            loading={loading}
                            dataSource={data.list}
                            columns={columns}
                            pagination={data.pagination}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>}
                {modalVisible &&  <RlsAutDetail { ...modalProps } />}
            </PageHeaderLayout>
        );
    }
}
