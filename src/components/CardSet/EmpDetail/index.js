import React, { Component } from 'react';
import { Card, Upload, Icon, Form, DatePicker, Select, Input, Row, Col, Button  } from 'antd';
import {api} from '../../../utils/config';
import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;


@Form.create()
export default class EmpDetail extends Component {
    state = {
        loading: false,
        imageUrl: "http://localhost/personnel/public/image/uploads/20180405/timg.jpg",
        orgemp_id:0,
        evaluate:"",
        award:[],
        baseinfo:{},
        workinfo:{},
        empBase:[
            {
                name:"姓名",
                key:"name",
                type:0,
                rules:[],
            },{
                name:"性别",
                key:"sex",
                type:[
                    {key:1,val:"男"},
                    {key:2,val:"女"},
                    {key:3,val:"未知"},
                ],
                rules:[],
            }, {
                name:"身份证号",
                key:"idno",
                type:0,
                rules:[],
            }, {
                name:"政治面貌",
                key:"political",
                type:[
                    {key:1,val:"群众"},
                    {key:2,val:"党员"},
                ],
                rules:[],
            }, {
                name:"婚姻状况",
                key:"married",
                type:[
                    {key:1,val:"未婚"},
                    {key:2,val:"已婚"},
                    {key:3,val:"离异"},
                    {key:4,val:"丧偶"},
                ],
                rules:[],
            }, {
                name:"学历",
                key:"education",
                type:[
                    {key:1,val:"专科及以下"},
                    {key:2,val:"本科"},
                    {key:3,val:"硕士研究生"},
                    {key:4,val:"博士研究生"},
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
                rules:[],
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
                rules:[],
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
                    {key:1,val:"在职"},
                    {key:2,val:"离职"},
                    {key:3,val:"休假"},
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
        logo:[],
        text:[],
        code:[],
        dept:[],
        frontimage:"",
        backimage:"",
    };

    componentWillReceiveProps(nextProps){

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

        let logo = nextProps.logo,
            text = nextProps.text,
            code = nextProps.code,
            frontimage = nextProps.frontimage,
            backimage = nextProps.backimage;

        logo = logo?JSON.parse(logo):[];
        text = text?JSON.parse(text):[];
        code = code?JSON.parse(code):[];
        frontimage = frontimage?frontimage:"";
        backimage = backimage?backimage:"";

        this.setState({
            evaluate:evaluate,
            imageUrl:imageUrl,
            award:nextProps.awardinfo || [],
            baseinfo:nextProps.baseinfo || {},
            workinfo:nextProps.workinfo || {},
            logo:logo,
            text:text,
            code:code,
            frontimage:frontimage,
            backimage:backimage,
            prof:nextProps.po,
            frontimage:nextProps.frontimage || "",
            backimage:nextProps.backimage || "",
            dept:nextProps.de || [],
        })

        this.initCardInfo();
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
                this.setState({
                    imageUrl:path,
                    loading:false,
                })

            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (!err) {

                let orgemp_id = 0;
                if(this.state.workinfo){

                    values['orgemp_id'] = this.state.workinfo['orgemp_id'];
                }

                if(this.state.baseinfo){

                    values['id'] = this.state.baseinfo['id'];
                    values['portrait'] = this.state.imageUrl;
                    values['entry_time'] = moment(values['entry_time']).format('YYYY-MM-DD');
                }

                if(this.state.award){
                    //转换award格式
                    let award = this.state.award;

                    for(let temp in award){
                        award[temp]['content'] = values['award'][temp];
                    }

                    values['award'] = award;
                }

                this.props.dispatch({
                    type: 'emptree/saveEmpDetail',
                    payload: values,
                });

                this.props.form.resetFields();
            }
        });
    }

    handleSelectChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onChange = (date, dateString) => {
        // console.log(date, dateString);
    }

    /**
     * 根据员工信息初始化卡片内容
     */
    initCardInfo(){
        const { text, baseinfo, workinfo, dept } = this.state;

        if(JSON.stringify(baseinfo)=="{}" || !text.length || JSON.stringify(workinfo)=="{}"){
            return;
        }

        //学历值设置 (1.专科及以下 2.本科 3.硕士研究生 4.博士研究生)
        let education = ['','专科及以下','本科','硕士研究生','博士研究生'];

        let newtext = text.map(item =>{

            if(item.column == "emp_name"){
                item.text = baseinfo['name'];
            }

            if(item.column == "phone"){
                item.text = "电话："+baseinfo['phone'];
            }

            if(item.column == "position"){
                item.text = "职位："+workinfo['position'];
            }

            if(item.column == "email"){
                item.text = "邮箱："+baseinfo['email'];
            }

            if(item.column == "tel"){
                item.text = "座机："+baseinfo['tel'];
            }

            if(item.column == "education"){
                item.text = "学历："+education[baseinfo['education']];
            }

            if(item.column == "dept"){
                let org_id = workinfo['org_id'];

                let org_info = dept.filter(item => item.key == org_id);

                if(org_info.length){
                    item.text = "部门："+org_info[0]['val'];
                }
            }

            if(item.column == "prof"){
                let prof_id = workinfo['prof_id'];

                let prof_info = this.state.prof.filter(itemp => itemp.key == prof_id);

                if(prof_info.length){
                    item.text = "职称："+prof_info[0]['val'];
                }
            }

            return item;
        })

        this.setState({
            text:newtext
        })

    }

    componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

      const { loading, empBase, workBase, evaluate, award, baseinfo, workinfo, frontimage} = this.state;
      const { getFieldDecorator, getFieldValue, setFieldsValue  } = this.props.form;
      const { codeurl, codeparam } = this.props;

      //正面logo元素
      const logo = this.state.logo.map(item =>item.reverse==1 && <img src={item.url} key={item.id} width={item.width} height={item.height}
                                                                      style={{left:item.left,top:item.top,position:"absolute"}}
          />
      );

      const code = this.state.code.map(item =>item.reverse==1 && <img src={!workinfo['code_no']?item.url:codeurl+workinfo['code_no']+codeparam }
                                                                      key={item.id} width={item.width} height={item.height}
                                                                      style={{left:item.left,top:item.top,position:"absolute"}}
      />);


      const text = this.state.text.map(item =>item.reverse==1 && <div key={item.id} width={item.width} height={item.height} color={item.color}
                                                                      style={{left:item.left,
                                                                          top:item.top,
                                                                          position:"absolute",
                                                                          cursor:"default",
                                                                          fontSize:item.size,
                                                                          fontFamily:item.family,
                                                                          fontStyle:item.style,
                                                                          height:item.size,
                                                                          lineHeight:item.size,
                                                                          color:item.color,
                                                                          textAlign:"center",
                                                                      }}
      >{item.text}</div>);

      const uploadButton = (
          <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传头像</div>
          </div>
      );
      const imageUrl = this.state.imageUrl;

      const empBaseItems = empBase.map((item) => {


          return (
              <Col  xs={24} sm={8} key={item.key}>
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
                                          <Option value={key['key']} key={key['key']}>{key['val']}</Option>
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
                                              <Option value={key['key']} key={key['key']}>{key['val']}</Option>
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
                      label="获奖记录"
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

      const formItemLayoutWithOutLabel = {
          wrapperCol: {
              xs: { span: 24, offset: 10 },
              sm: { span: 20, offset: 10 },
          },
      };




      return (
        <div className={styles.empdetailForm}>
            <Form onSubmit={this.handleSubmit}>

                <Card
                    type="inner"
                    title="员工详情"
                    extra={<a href="javascript:;"></a>}
                >
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
                    title="工作名片"
                    extra={<a href="javascript:;"></a>}
                >
                    <div className={styles.preCardPanel}
                         style={{background:frontimage==""?"white":"url("+frontimage+") no-repeat"}}
                    >
                        {logo}
                        {code}
                        {text}
                    </div>

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

                    <Row gutter={24}>
                        <Col xs={24} sm={24}>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Button type="primary" htmlType="submit">提交修改</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    );
  }
}
