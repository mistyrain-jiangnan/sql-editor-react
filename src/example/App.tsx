import {  useState } from "react";

import type { FC } from "react";


import DiffEditor from "../DiffEditor/index";

import React from "react";

const App: FC = () => {

  const [original] = useState("This is the original text.");
  const [modified] = useState("This is the modified text.");
  


  const handleChange = (newValue) => {
    console.log("Content changed:", newValue);
    // 处理内容变化事件
  };
  return (
    <>
      <div style={{ height: "600px"}}>
      <DiffEditor
        width="1000"
        height="100%"
        original={original}
        value={modified}
        language="sql" // 可以根据需要设置语言
        theme="naruto" // 可以设置主题
        onChange={handleChange}
        editorDidMount={(editor, monaco) => {
          console.log("Editor mounted", editor, monaco);
        }}
        editorWillUnmount={(editor, monaco) => {
          console.log("Editor will unmount", editor, monaco);
        }}
      />
    </div>
    </>
  );
};
export default App;
