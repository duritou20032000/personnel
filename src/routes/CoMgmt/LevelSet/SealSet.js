import { Form, Input, Icon, Button, Tabs, Select } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
const Option = Select.Option;
let uuid = 0;
@connect(({ levelset, loading }) => ({
    levelset,
    loading: loading.models.levelset,
}))
@Form.create()
export class SealSet extends React.Component {

    state = {
        curritem:[],
        keys:[],
        currid:3,
        currseal:0,
        tag:['seal','apv'],
        seal:this.props.levelset.seal,
        apv:this.props.levelset.apv,
        deptEmp:this.props.levelset.deptEmp,
        init:false,
    }

    componentDidMount() {
        const { dispatch, levelset } = this.props;
        dispatch({
            type: 'levelset/fetchSeal',
        });

        dispatch({
            type: 'levelset/fetchDeptEmp',
        });

        this.initTabPane(3);
    }

    componentWillReceiveProps(nextProps){

        const { form, levelset } = nextProps;
        let object = this.state.tag;

        if(levelset.seal.length>0 && !this.state.init){
            let array = levelset[object[this.state.currid - 3]];

            this.setState({
                seal:levelset.seal,
                apv:levelset.apv,
                deptEmp:levelset.deptEmp,
                curritem:array || [],
                keys:array.map(item => item.id),
                init:true,
            })
        }

    }

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });

        //增加数据
        let key = this.state.currid,
            keyarray = this.state.keys;
        keyarray.splice(keyarray.indexOf(k),1);
        this.setState({
            keys:keyarray,
            curritem:this.state.curritem.filter(item => item.id != k) || []
        });

        let object = this.state.tag;
        let data = this.state[object[key - 3]];

        let newobject = {};
        newobject[object[key - 3]] = data.filter(item => item.id != k);
        this.setState(newobject);

    }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });

        let good = form.getFieldValue("names");
        if(!good){
            good = [];
        }

        let goodjson = [];
        for(let temp in good){
            goodjson.push({
                id:parseInt(temp),
                value:good[temp]
            })
        }

        //增加数据
        let key = this.state.currid,
            keyarray = this.state.keys;
        keyarray.push(uuid);

        goodjson.push({id:uuid,value:"",});
        this.setState({
            keys:keyarray,
            curritem:goodjson || [],
        });

        let object = this.state.tag;
        let data = this.state[object[key - 3]];
        data.push({
            id:uuid,
            value:"",
        })

        let newobject = {};
        newobject[object[key - 3]] = data;
        this.setState(newobject);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                let data = values["names"];

                if(this.state.currid==3){

                    this.props.dispatch({
                        type: 'levelset/updateSeal',
                        payload: {
                            key:this.state.currid,
                            seal:data.filter(item => item != null)
                        },
                    });
                }else{

                    let sealid = this.state.currseal;

                    this.props.dispatch({
                        type: 'levelset/updateProcess',
                        payload: {
                            sealid:sealid,
                            apv:data.filter(item => item != null)
                        },
                    });
                }

            }
        });
    }

    //tab页点击事件
    tabClick = (key) => {

        this.initTabPane(key);
    }

    //初始化tab
    initTabPane = (key) =>{

        const { form } = this.props;
        let  currid = key,
            curritem = [],
            keys = [],
            index = 0;

        let object = this.state.tag;
        curritem = this.state[object[key - 3]];

        //提取id作为key
        for(let temp in curritem){
            let tid = curritem[temp]['id'];
            index = index<tid?tid:index;
            keys.push(tid);
        }

        this.setState({
            curritem:curritem || [],
            keys:keys,
            currid:currid,
        })

        uuid = index + 2;

        form.resetFields();
    }

    //input获取焦点事件
    onInputBlur = (e,index) =>{

        let value = e.target.value,
            object = this.state.tag,
            key = this.state.currid,
            data = this.state[object[key - 3]];

        //提取id作为key
        let newobject = {};
        newobject[object[key - 3]] = data.filter(item => {
            if(item.id == index){
                item.value = e.target.value;
            }
            return item;
        });
        this.setState(newobject);

    }

    //选择印章，查询审核流程数据
    handleChange = (value) => {

        //记录当前印章id，并获取审核数据
        this.setState({
            currseal:value,
            init:false,
        });

        this.props.dispatch({
            type: 'levelset/fetchProcess',
            payload: {
                seal:value
            },
        });


    }

    render() {
        const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };

        getFieldDecorator('keys', { initialValue: this.state.keys});

        //当前表单的key
        const keys = this.state.keys || [];
        const currid = this.state.currid;
        const label = ["印章","审核人"];

        const deptEmp = this.state.deptEmp || [];

        const deOptions = deptEmp.map((key,index) => {
            return (
                <Option value={String(key['id'])} key={key['id']}>{key['value']}</Option>
            )
        });

        const formItems = keys.map((k, index) => {

            //当前表单数据项数组
            let curritem = this.state.curritem || [];
            //当前数据项目
            let item = curritem.filter(key => key.id == k)[0];

            let item_label = "";
            if(currid == 3 && index === 0){
                //印章tab项第一条数据显示印章
                item_label = label[currid-3];
            }

            if(currid == 4){
                item_label = "第"+(index+1)+"审核人";
            }

            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : currid == 4 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={item_label}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`names[${k}]`, {
                        initialValue: item['value'] ? String(item['value']) : '',
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入内容或者删除这个文本框",
                        }],
                    })(
                        (currid == 3 && <Input placeholder=""  style={{ width: '347px', marginRight: 8 }} onBlur={(e) => this.onInputBlur(e,k)}/>) ||
                        (currid == 4 &&
                            <Select
                                showSearch
                                style={{ width: 347,marginRight:10 }}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {deOptions}
                            </Select>
                        )
                    )}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </FormItem>
            );
        });

        const seal = this.state.seal || [];

        const options = seal.map((key,index) => {
            return (
                <Option value={key['id']} key={key['id']}>{key['value']}</Option>
            )
        });

        return (
            <Tabs
                defaultActiveKey="3"
                tabPosition="left"
                onTabClick={(key) => this.tabClick(key)}
            >
                <TabPane tab="类型" key="3">
                    <Form onSubmit={this.handleSubmit}>
                        {formItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.add}  style={{ width: '347px' }}>
                                <Icon type="plus" /> 添加文本框
                            </Button>
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane tab="流程" key="4">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Select style={{ width: 347 }} onChange={this.handleChange}>
                                {options}
                            </Select>
                        </FormItem>
                        {formItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.add}  style={{ width: '347px' }}>
                                <Icon type="plus" /> 添加文本框
                            </Button>
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
        );
    }
}
