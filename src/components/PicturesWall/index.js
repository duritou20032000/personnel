import { Upload, Icon, Modal } from 'antd';

export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
        //     {
        //     uid: -1,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }
        ],
        color:["#52c41a","#f5222d","#fadb14",""],
        type:["check-circle","close-circle","clock-circle",""],
        text:["缤纷认证","认证未通过","等待审核",""],
    };

    componentWillReceiveProps(nextProps){

        if(Object.prototype.toString.call(nextProps.image).toLowerCase() == "[object object]" ){
             //初始化图片
            this.setState({
                fileList:[nextProps.image]
            })
        }
    }

    handleCancel = () => {
        this.setState({ previewVisible: false })
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {

        if(fileList.length>0 && fileList[0]['response']){
            let url = fileList[0]['response']['path'];
            if(this.props.imageadd){
                //添加了图片，回调
                this.props.imageadd(this.props.keyval,url);
            }

        }

        this.setState({ fileList })
    }

    handleRemove = (file) => {

        if(this.props.imagedel){
            //移除图片，回调
            this.props.imagedel(this.props.keyval);
        }
    }

    render() {
        const { previewVisible, previewImage, fileList, color, type, text } = this.state;
        const { approve } = this.props;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div>
                <div className="clearfix">
                    <Upload
                        action={this.props.uploadurl}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        onRemove={this.handleRemove}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div>
                <div className="clearfix" style={{fontSize:"14px"}}>
                    <Icon type={type[approve]}  style={{color:`${color[approve]}`}}/> {text[approve]}
                </div>
            </div>
        );
    }
}