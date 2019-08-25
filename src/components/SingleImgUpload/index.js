import { Upload, Icon, message } from 'antd';
import styles from './index.less';

var imgExt = new Array(".png",".jpg",".jpeg",".bmp",".gif");//图片文件的后缀名

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';

    // if(typeMatch(imgExt, filename)){
    //     alert("是图片文件");
    // }

    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片必须小于 2MB!');
    }
    return isJPG && isLt2M;
}

//获取文件名后缀名
String.prototype.extension = function(){
    var ext = null;
    var name = this.toLowerCase();
    var i = name.lastIndexOf(".");
    if(i > -1){
        var ext = name.substring(i);
    }
    return ext;
}

//判断Array中是否包含某个值
Array.prototype.contain = function(obj){
    for(var i=0; i<this.length; i++){
        if(this[i] === obj)
            return true;
    }
    return false;
};

function typeMatch(type, fielname){
    var ext = filename.extension();
    if(type.contain(ext)){
        return true;
    }
    return false;
}

export default class SingleImgUpload extends React.Component {
    state = {
        loading: false,
        url:"",
        setFormValue:function(){},
        key:"",
    };

    componentDidMount(){

        this.setState({
            url:this.props.url,
            setFormValue:this.props.setFormValue,
            key:this.props.key,
        })
        console.log(this.state);
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));

            this.props.onChange(info);
        }
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={this.state.url}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="" className={styles.uploadImage}/> : uploadButton}
            </Upload>
        );
    }
}
