import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import styles from './style.less';
import {api} from '../../utils/config';

class EditModel extends React.Component {

    state = {
        editorState: BraftEditor.createEditorState(),
        placeholder:"",
    }

    constructor(props) {
        super(props);

        const value = props.value || "";
        const placeholder = props.placeholder || "";

        this.state = {
            editorState:BraftEditor.createEditorState(value),
            placeholder:placeholder,
        };

    }

    componentDidMount(){
        this.props.onRef(this)
    }

    handleChange = (editorState) => {

        const onChange = this.props.onChange;

        this.setState({ editorState })

        if (onChange) {
            onChange(editorState.toHTML());
        }
    }

    handleReset = () => {
console.log("do");
        this.setState({
            editorState:BraftEditor.createEditorState(""),
        });
    }

    myUploadFn = (param) => {

        const serverURL = api.uploadimage
        const xhr = new XMLHttpRequest
        const fd = new FormData()

        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            // console.log(response,xhr.responseText);
            let text = xhr.responseText;
            let json = JSON.parse(text);
            let path = json.path;

            console.log(path);

            param.success({
                url: path,
                meta: {
                    id: 'xxx',
                    title: 'xxx',
                    alt: 'xxx',
                    loop: true, // 指定音视频是否循环播放
                    autoPlay: true, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                }
            })
        }

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        }

        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.'
            })
        }

        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)

        fd.append('file', param.file)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)

    }

    render () {

        const excludeControls = [
            'letter-spacing',
            'line-height',
            'clear',
            'headings',
            'list-ol',
            'list-ul',
            'remove-styles',
            'superscript',
            'subscript',
            'hr',
            'text-align'
        ]

        return (
            <div className={styles.editorWrapper}>
                <BraftEditor
                    value={this.state.editorState}
                    media={{uploadFn: this.myUploadFn}}
                    onChange={this.handleChange}
                    excludeControls={excludeControls}
                    contentStyle={{height: 400}}
                    placeholder={this.state.placeholder}
                />
            </div>
        )

    }
}

export default EditModel;