import React, { Component } from 'react';
import { Card, Upload, Icon, Form, DatePicker, Select, Input, Row, Col  } from 'antd';
import {api} from '../../../utils/config';
import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;


@Form.create()
export default class EditEmpDetail extends Component {
    state = {
        loading: false,
        imageUrl: "http://localhost/personnel/public/image/uploads/20180405/timg.jpg",
        orgemp_id:0,
        evaluate:"",
        award:[],
        baseinfo:[],
        workinfo:[],
        empBase:[
            {
                name:"姓名",
                key:"name",
                type:0,
                rules:[{
                    required:true,
                    message:"请填写员工姓名"
                }],
            },{
                name:"性别",
                key:"sex",
                type:[
                    {value:1,text:"男"},
                    {value:2,text:"女"},
                    {value:3,text:"未知"},
                ],
                rules:[],
            }, {
                name:"身份证号",
                key:"idno",
                type:0,
                rules:[{
                    required:true,
                    message:"请填写身份证号"
                }],
            }, {
                name:"政治面貌",
                key:"political",
                type:[
                    {value:1,text:"群众"},
                    {value:2,text:"党员"},
                ],
                rules:[],
            }, {
                name:"婚姻状况",
                key:"married",
                type:[
                    {value:1,text:"未婚"},
                    {value:2,text:"已婚"},
                    {value:3,text:"离异"},
                    {value:4,text:"丧偶"},
                ],
                rules:[],
            }, {
                name:"学历",
                key:"education",
                type:[
                    {value:1,text:"专科及以下"},
                    {value:2,text:"本科"},
                    {value:3,text:"硕士研究生"},
                    {value:4,text:"博士研究生"},
                ],
                rules:[],
            }, {
                name:"座机",
                key:"tel",
                type:0,
                rules:[],
            },{
                name:"手机",
                key:"phone",
                type:0,
                rules:[{
                    required:true,
                    message:"请填写手机号码"
                }],
            },{
                name:"邮箱",
                key:"email",
                type:0,
                rules:[],
            },
        ],
        workBase:[
            {
                name:"员工ID",
                key:"emp_no",
                type:0,
                rules:[],
            },{
                name:"所属部门",
                key:"org_id",
                type:[],
                rules:[{
                    required:true,
                    message:"请填写所属部门"
                }],
            },{
                name:"序列",
                key:"seq_id",
                type:[],
                rules:[],
            },{
                name:"职称",
                key:"prof_id",
                type:[],
                rules:[],
            },{
                name:"职位",
                key:"position",
                type:0,
                rules:[],
            },{
                name:"权限",
                key:"priv_id",
                type:[],
                rules:[],
            },{
                name:"在职态",
                key:"state",
                type:[
                    {value:1,text:"在职"},
                    {value:2,text:"离职"},
                    {value:3,text:"休假"},
                ],
                rules:[],
            },{
                name:"入职时间",
                key:"entry_time",
                type:1,
                rules:[],
            },{
                name:"工作年限",
                key:"years",
                type:0,
                rules:[],
            },
        ],
    };

    componentWillMount() {
        const nextProps = this.props;

        let workBase = this.state.workBase;

        for(let temp in workBase){

            let item = workBase[temp];
            if(item.key=="seq_id"){
                item['type'] = nextProps.se;
            }
            if(item.key=="prof_id"){
                item['type'] = nextProps.po;
            }
            if(item.key=="priv_id"){
                item['type'] = nextProps.pr;
            }
            if(item.key=="org_id"){
                item['type'] = nextProps.de;
            }

            workBase[temp] = item;
        }

        let evaluate = "";
        let imageUrl = "";
        if(nextProps.workinfo){
            evaluate = nextProps.workinfo.evaluate;
            imageUrl = nextProps.baseinfo.portrait;
        }

        this.setState({
            evaluate:evaluate,
            imageUrl:imageUrl,
            award:nextProps.awardinfo || [],
            baseinfo:nextProps.baseinfo || [],
            workinfo:nextProps.workinfo || [],
        })
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.

            if(info.file){
                let path = info.file.response.path;

                const { getUploadImage } = this.props;

                getUploadImage(path);

                this.setState({
                    imageUrl:path,
                    loading:false,
                })

            }
        }
    }

    handleSelectChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onChange = (date, dateString) => {
        // console.log(date, dateString);
    }

    componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

      const { loading, empBase, workBase, evaluate, award, baseinfo, workinfo } = this.state;
      const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;

      const uploadButton = (
          <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传头像</div>
          </div>
      );
      const imageUrl = this.state.imageUrl;

      const empBaseItems = empBase.map((item) => {


          return (
              <Col  xs={24} sm={8} key={item.key} style={{marginBottom:"0px"}}>
                  <FormItem
                      label={item['name']}
                      required={false}
                      key={item.key}
                  >
                      {getFieldDecorator(`${item['key']}`, {
                          initialValue: baseinfo ? baseinfo[item.key] : '',
                          rules: item['rules'],
                      })(
                          (typeof(item['type'])=="object")?(
                              <Select
                                  onChange={this.handleSelectChange}
                                  placeholder={item['name']}
                                  showSearch
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              >
                                  {item['type'].map((key, opindex) => {
                                      return (
                                          <Option value={key['value']} key={key['value']}>{key['text']}</Option>
                                      )
                                  })}
                              </Select>
                          ):(
                              <Input placeholder={item['name']}/>
                          )
                      )}
                  </FormItem>
              </Col>
          );
      });


      const workBaseItems = workBase.map((item) => {

          let entry_time = moment(new Date());
          if(workinfo){
              //默认时间
              if(item.key=="entry_time" && workinfo[item.key]){
                  entry_time = moment(workinfo[item.key],"YYYY/MM/DD");
              }
          }

          return (
              <Col  xs={24} sm={8} key={item.key}>
                  <FormItem
                      label={item['name']}
                      required={false}
                  >
                      {getFieldDecorator(`${item['key']}`, {
                          initialValue: workinfo?item.key=="entry_time"?entry_time: workinfo[item.key] : '',
                          rules: item['rules'],
                      })(
                          (typeof(item['type'])!="object")?
                              item['type']!=1?(
                                  <Input placeholder={item['name']}/>
                              ):(
                                  <DatePicker onChange={this.onChange}   placeholder={item['name']}/>
                              ):(
                                  <Select onChange={this.handleSelectChange}
                                          placeholder={item['name']}
                                          showSearch
                                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                      {item['type'].map((key, opindex) => {
                                          return (
                                              <Option value={key['value']} key={key['value']}>{key['text']}</Option>
                                          )
                                      })}
                                  </Select>
                              )
                      )}
                  </FormItem>
              </Col>
          );
      });

      const awardItems = award.map((item,index) => {

          return (
              <Col  xs={24} sm={24} key={index}>
                  <FormItem
                      label={index==0?"获奖记录":""}
                      required={false}
                  >
                      {getFieldDecorator(`award[${index}]`, {
                          initialValue: item ? item['content'] : '',
                      })(
                          <Input placeholder="获奖记录"/>
                      )}
                  </FormItem>
              </Col>
          );
      });


      return (
        <div>
            <Form>
                <Card>
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={ api.upload }
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                    >
                        <div className={styles.uploadParentDiv}>
                            {imageUrl ? <img src={imageUrl} alt=""  className={styles.portrait}/> : uploadButton}
                            <div className={styles.uploadNoticeBg}>
                                <span>点击上传头像</span>
                            </div>
                        </div>
                    </Upload>

                </Card>

                <Card
                    type="inner"
                    title="基本信息"
                    extra={<a href="javascript:;"></a>}
                >
                    <Row gutter={24}>
                        {empBaseItems}
                    </Row>
                </Card>

                <Card
                    type="inner"
                    title="工作信息"
                    extra={<a href="javascript:;"></a>}
                >
                    <Row gutter={24}>
                        {workBaseItems}
                        <Col xs={24} sm={24}>
                            <FormItem
                                label="工作评价"
                                required={false}
                            >
                                {getFieldDecorator(`evaluate`, {
                                    initialValue: evaluate,
                                })(
                                    <TextArea rows={5} placeholder="工作评价"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={24}>
                            {awardItems}
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    );
  }
}
