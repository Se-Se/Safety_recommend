// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import React, { useEffect, useState } from 'react';

export default function EditorBraft(props: any) {
  const val = BraftEditor.createEditorState(null);
  const [editorState, setEditorState] = useState(val);

  useEffect(() => {
    const htmlContent = props.editData;
    const html = BraftEditor.createEditorState(htmlContent);
    setEditorState(html);
  }, [props.editData]);

  const submitContent = () => {
    const htmlContent = editorState.toHTML();
    console.log(htmlContent);
    props.saveEdit(htmlContent);
  };
  const handleEditorChange = data => {
    setEditorState(data);
  };
  return (
    <div className="my-component">
      <BraftEditor readOnly={props.isEdit} value={editorState} onChange={handleEditorChange} onSave={submitContent} />
    </div>
  );
}
