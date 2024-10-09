import styles from './shared.module.scss';
import ReactQuill, { Quill,  } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useRef } from 'react';
const CustomButton = ({quillRef} : {quillRef: any}) => {
  console.log("$$ ~ quillRef:", )
  
  function insertStar(e: any) {
    const quill = quillRef.current.getEditor()
    const cursorPosition = quill.getSelection()?.index ?? 1;
    quill.pasteHTML(cursorPosition, "<button style='background-color: red; color: red;'>Button</button>");
    quill.setSelection(cursorPosition + 1);
  }
  return ( <span className="octicon octicon-star" onClick={insertStar} >B</span>)};



const CustomToolbar = ({quillRef} : {quillRef: any}) => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <button className="ql-insertStar">
      <CustomButton quillRef={quillRef} />
    </button>
  </div>
);

export function Shared() {
  const [value, setValue] = React.useState('');
  const quillRef = useRef(null)
  console.log("$$ ~ value:", value)
  
  return (
    <>
      <CustomToolbar quillRef={quillRef} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        ref={quillRef}
        modules={{
          toolbar: {
            container: '#toolbar',
          }
        }}
      />
    </>
  );
}

export default Shared;
