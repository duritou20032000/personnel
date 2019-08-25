import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Tree, Icon } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './AwardSet.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@connect(({ awardset, loading }) => ({
  awardset,
  loading: loading.models.awardset,
}))
@Form.create()
export default class AwardSet extends PureComponent {
  state = {
      employee:[
      ],

  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awardset/fetch',
    });
  }

  componentWillReceiveProps(nextProps){

      const { awardset:{ list } } = nextProps;
      this.setState({
          employee:list,
      })
  }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);
            if(!err){
                if(values['awardname']){
                    //上传数据
                    let employee = this.state.employee,emplist = [];
                    for(let temp in employee){
                        if(employee[temp]["checked"]){
                            emplist.push(employee[temp]['id']);
                        }
                    }

                    if(!emplist.length){
                        console.log("没有选择获奖的员工");
                        return;
                    }

                    this.props.dispatch({
                        type: 'awardset/savelist',
                        payload:{
                            awardname:values['awardname'],
                            list:emplist,
                        }
                    });

                }

                console.log(values);
            }
        });
    }

    handleImageDel = (key) =>{

        this.props.dispatch({
            type: 'awardset/del',
            payload:{
                key:key
            }
        });
    }

    onSelect = (selectedKeys, info) => {

        const { dispatch } = this.props;
        let key = selectedKeys[0];
        if(!key){return;}

        dispatch({
            type: 'awardset/fetchList',
            payload:{
                id:key
            }
        });

        // console.log('selected', selectedKeys, info);
    }

    handleChecked = (index) =>{
        let employee = this.state.employee;
        let m = employee.map(item => {
            if(item.id == index){
                item.checked = !item.checked;
            }

            return item;
        })

        this.setState({
            employee:m,
        })
    }

    handleAllChecked = () =>{

        let employee = this.state.employee;
        let m = employee.map(item => {

            item.checked = 1;
            return item;
        })

        this.setState({
            employee:m,
        })
    }

    handleAllDel = () =>{

        let employee = this.state.employee;
        let m = employee.map(item => {

            item.checked = 0;
            return item;
        })

        this.setState({
            employee:m,
        })
    }

  render() {
      const { employee } = this.state;
      const { awardset: { data }, loading, dispatch } = this.props;
      const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;

      const loop = data => data.map((item) => {
          if (item.children) {
              return (
                  <TreeNode title={item.title} key={item.key} >
                      { loop(item.children) }
                  </TreeNode>
              )
          }
          return (
              <TreeNode title={item.title} key={item.key} />
          )
      })

      const emplist = this.state.employee.map(item => {
          if(item.checked){
              return <span onClick={()=>this.handleChecked(item.id)} key={item.id}><Icon type="check-circle" />{item.name}</span>
          }else{
              return <span onClick={()=>this.handleChecked(item.id)} key={item.id}><Icon type="check-circle"  style={{display:"none"}}/>{item.name}</span>
          }
      })

      const checkedlist = this.state.employee.map(item => {
          if(item.checked){
              return <span onClick={()=>this.handleChecked(item.id)} key={item.id}>{item.name}<Icon type="close" /></span>
          }
      })

      return (
      <PageHeaderLayout title="">
            <Form
                className={styles.antAdvancedSearchForm}
                onSubmit={this.handleSearch}
            >
                <Card
                    type="inner"
                    title="名称设置"
                    extra={<a href="javascript:;"></a>}
                >
                    <Row gutter={24}>
                        <FormItem label="奖励名称" className={styles.antFormItem}>
                            {getFieldDecorator('awardname', {
                            })(
                                <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Row>
                </Card>

                <Card
                    type="inner"
                    title="选择员工"
                    extra={<a href="javascript:;"></a>}
                >
                    <Row gutter={24}>

                        <Col sm={7} xs={24}>
                            <div className={styles.orgTree}>
                                <Tree
                                    showLine
                                    onSelect={this.onSelect}
                                >
                                    {loop(data)}
                                </Tree>
                            </div>
                        </Col>
                        <Col sm={17} xs={24}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={styles.empList}>
                                        <div>
                                            <div onClick={()=>this.handleAllDel()}><Icon type="delete" />删除</div>
                                            <div onClick={()=>this.handleAllChecked()}><Icon type="check-square-o" />全选</div>
                                        </div>
                                        <div>
                                            {emplist}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={styles.empCheck}>
                                        {checkedlist}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24} offset={18}>
                            <FormItem >
                                <Button type="primary" htmlType="submit" className={styles.orgButton} onClick={(e)=>this.handleSearch(e)}>保存</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Card>

            </Form>
      </PageHeaderLayout>
    );
  }
}
