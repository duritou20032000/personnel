import { PureComponent } from 'react';
import { connect } from 'dva';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import styles from './style.less';

class EditModel extends PureComponent{

    state = {
        editorState:EditorState.createEmpty(),
        value:"",
    }

    constructor(props) {
        super(props);

        const value = props.value || "";

        const contentBlock = htmlToDraft(value);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }

    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){

    }

    onEditorStateChange = (editorState) => {

        const changedValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }

        this.setState({
            editorState,
            value:changedValue
        });
    };

    render(){

        return (
            <div>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName={styles.demoeditor}
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        )
    }
}

export default EditModel;