import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Tabs } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { SealSet } from './SealSet';
import { Level } from './Level';
import { EditableTree } from 'components/EditableTree';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

let uuid = 0;

@connect(({ levelset, loading }) => ({
    levelset,
  loading: loading.models.levelset,
}))
@Form.create()
export default class LevelSet extends PureComponent {
  state = {
      curritem:[],
      keys:[],
      currid:3,
  };

    componentDidMount() {
        const { dispatch, levelset:{ level } } = this.props;
          dispatch({
              type: 'levelset/fetchOrg',
          });
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
    const { levelset: { initTree, level }, loading, dispatch } = this.props;

    const EditableProps = {
        addNode: function(key){
            dispatch({
                type: 'levelset/createTree',
                payload: {
                    key:key
                },
            });
        },
        delNode: function(key){
            dispatch({
                type: 'levelset/removeTree',
                payload: {
                    key:key
                },
            });
        },
        updateNode:function(key,value){
            dispatch({
                type: 'levelset/updateTree',
                payload: {
                    title:value,
                    key:key
                },
            });
        },
        initTree: initTree,
    }


    return (
        <PageHeaderLayout title="">
            <Card bordered={false}>
                <Tabs
                    defaultActiveKey="1"
                >
                    <TabPane tab={<span><Icon type="fork" />组织机构</span>} key="1">
                        <EditableTree {...EditableProps}></EditableTree>
                    </TabPane>
                    <TabPane tab={<span><Icon type="appstore-o" />等级设置</span>} key="2">
                        <Level ></Level>
                    </TabPane>

                    <TabPane tab={<span><Icon type="safety" />印章设置</span>} key="3">
                        <SealSet ></SealSet>
                    </TabPane>
                </Tabs>
            </Card>
        </PageHeaderLayout>
    );
  }
}
