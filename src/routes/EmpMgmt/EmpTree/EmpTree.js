import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Tree, Row, Col, Upload, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {api} from '../../../utils/config';
import { EmpDetail } from '../../../components/CardSet/index'

import styles from './EmpTree.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;

let uuid = 0;

@connect(({ emptree, loading }) => ({
    emptree,
  loading: loading.models.emptree,
}))
@Form.create()
export default class EmpTree extends PureComponent {
  state = {
      curritem:[],
      keys:[],
      prevcount:0,

  };

    componentDidMount() {
        const { dispatch, emptree:{ level } } = this.props;
          dispatch({
              type: 'emptree/fetchOrg',
          });

        dispatch({
            type: 'emptree/fetchOption',
        });

        dispatch({
            type: 'emptree/fetchCard',
        });

        this.props.dispatch({
            type: 'emptree/fetchConfig',
        });

    }

    onSelect = (selectedKeys, info) => {

        const { dispatch } = this.props;
        let key = selectedKeys[0];
        if(!key){return;}
        let split = key.split("emp");
        if(split.length>1){

            let emp_id = split[1];
            window.localStorage.setItem("curr_employee",emp_id);

            this.props.dispatch({
                type: 'emptree/fetchConfig',
            });

            dispatch({
                type: 'emptree/fetchDetail',
                payload:{
                    id:emp_id
                }
            });
        }

        // console.log('selected', selectedKeys, info);
    }

    render() {
    const { emptree: { initTree, po, se, pr, de, logo, text, code ,frontimage, backimage, codeurl, codeparam, empdetail:{awardinfo, baseinfo, workinfo} }, loading, dispatch } = this.props;

    const { prevcount } = this.state;
    let _this = this;
    let index = 0;
    const props = {
        name: 'file',
        multiple: true,
        showUploadList:false,
        action: api.upload,
        onChange(info) {
            const status = info.file.status;

            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {

                let length = info.fileList.length;
                let diff =  length - prevcount - 2;
                diff = diff<0?0:diff;

                if( diff == index){
                    //已经执行完成,后台开始处理excel
                    let fileList = info.fileList;
                    let excelpath = "";
                    let imagepath = [];
                    let imagekey = [];
                    if(fileList.length){
                        for(let temp in fileList){
                            let name = fileList[temp]['name'],
                                path = "";
                            if(fileList[temp]['response']){
                                path = fileList[temp]['response']['path'];
                            }

                            if(/(\.xls){1}|(\.xlsx){1}/ig.test(name)){
                                excelpath = path;
                            }else{

                                imagepath.push(path);
                                imagekey.push(name);
                            }
                        }
                        //处理excel导入员工信息
                        dispatch({
                            type: 'emptree/uploadInfo',
                            payload:{
                                image:imagepath,
                                imagekey:imagekey,
                                excel:excelpath
                            }
                        });

                        // console.log(excelpath,imagepath);
                    }

                    // console.log(index,diff,length);
                    _this.setState({
                        prevcount:length
                    })
                }

                index++;


                message.success(`${info.file.name} 文件上传成功.`);

            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        },
    };

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

        const empDetailProps = {
            dispatch,
            po:po,
            se:se,
            pr:pr,
            de:de,
            awardinfo:awardinfo,
            baseinfo:baseinfo,
            workinfo:workinfo,
            logo:logo,
            text:text,
            code:code,
            codeurl,
            codeparam,
            frontimage:frontimage,
            backimage:backimage,
        }


        return (
        <PageHeaderLayout title="">
            <Row gutter={24}>
                <Col  xs={24} sm={7} >
                    <Card
                       type="inner"
                       title="人员组织树"
                       extra={<a href="javascript:;"></a>}
                    >
                        <Row gutter={24}>
                            <Col  span={24} style={{overflow:"hidden"}}>
                                <Tree
                                    showLine
                                    onSelect={this.onSelect}
                                >
                                    {loop(initTree)}
                                </Tree>
                            </Col>
                        </Row>

                    </Card>
                    <Card
                        type="inner"
                        title="批量导出"
                        extra={<a href="javascript:;"></a>}
                    >
                        <Row gutter={24} style={{marginTop:"20px"}}>
                            <Col  span={24} >
                                <a href={api.exportcard} target="_bank" className={styles.btn}>批量导出员工名片</a>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        type="inner"
                        title="批量导入"
                        extra={<a href="javascript:;"></a>}
                    >
                        <Row gutter={24} style={{marginTop:"20px"}}>
                            <Col  span={24} >
                                <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="inbox" />
                                    </p>
                                    <p className="ant-upload-text">批量导入</p>
                                    <p className="ant-upload-hint">说明：点击或者拖拽文件到区域内上传，支持多文件上传，请将excel和图片一起选中上传</p>
                                </Dragger>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{marginTop:"20px"}}>
                            <Col  span={24} >
                                <a href={api.exceltemplate} target="_bank" className={styles.btn}>下载模板</a>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col  xs={24} sm={17} >
                    <EmpDetail {...empDetailProps}/>
                </Col>
            </Row>
        </PageHeaderLayout>
    );
  }
}
