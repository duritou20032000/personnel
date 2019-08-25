import { connect } from 'dva';
import { Form, Input, Icon, Button, Tabs } from 'antd';
import { EditableTree } from 'components/EditableTree';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

let uuid = 0;

@connect(({ levelset, loading }) => ({
    levelset,
    loading: loading.models.levelset,
}))
@Form.create()
export class Level extends React.Component {
    state = {
        curritem:[],
        keys:[],
        currid:3,
        position:this.props.levelset.level.position,
        sequence:this.props.levelset.level.sequence,
        privilege:this.props.levelset.level.privilege,
        tag:['position','sequence','privilege'],
        init:false,
    };

    componentDidMount() {
        const { dispatch, levelset:{ level } } = this.props;

        dispatch({
            type: 'levelset/fetchLevel',
        });

        this.initTabPane(3);
    }

    componentWillReceiveProps(nextProps){

        const { form, levelset:{ level } } = this.props;
        let object = this.state.tag;

        if(level.position && !this.state.init){
            let array = level[object[this.state.currid - 3]];

            this.setState({
                position:level.position,
                sequence:level.sequence,
                privilege:level.privilege,
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

                this.props.dispatch({
                    type: 'levelset/updateLevel',
                    payload: {
                        key:this.state.currid,
                        level:data.filter(item => item != null)
                    },
                });
            }
        });
    }

    tabClick = (key) => {

        this.initTabPane(key);
    }

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

        uuid = index + 1;

        form.resetFields();
    }

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

    render() {
        const { levelset: { level }, loading, dispatch } = this.props;

        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
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
        // getFieldDecorator('names', { initialValue: this.state.curritem || []});

        //当前表单的key
        const keys = this.state.keys || [];
        const currid = this.state.currid;

        const formItems = keys.map((k, index) => {

            //当前表单数据项数组
            let curritem = this.state.curritem || [];
            //当前数据项目
            let item = curritem.filter(key => key.id == k)[0];

            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '等级' : ''}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`names[${k}]`, {
                        initialValue: item['value'] ? item['value'] : '',
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入内容或者删除这个文本框",
                        }],
                    })(
                        <Input placeholder="" style={{ width: '347px', marginRight: 8 }} onBlur={(e) => this.onInputBlur(e,k)}/>
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

        return (
            <Tabs
                defaultActiveKey="3"
                tabPosition="left"
                onTabClick={(key) => this.tabClick(key)}
            >
                <TabPane tab="职称" key="3">
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
                <TabPane tab="序列" key="4">
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
                <TabPane tab="权限" key="5">
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
            </Tabs>
        );
    }
}
