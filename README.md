# 使用指南

该文档将指导您如何在 React 组件中使用 `MonacoEditor` 组件

## 1. 导入依赖


首先，您需要从相关库中导入必要的依赖：

```typescript
import { useRef, useState, type FC } from "react";


import  MonacoEditor from 'sql-editor-react'

import  {RefEditorInstance} from  'sql-editor-react/types'

import  'sql-editor-react/style'

const App: FC = () => {
  const editorRef = useRef<RefEditorInstance>(null);
  const [code] = useState("SELECT * FROM users;");
  return (
    <>
      <MonacoEditor
        ref={editorRef}
        height={200}
        theme="naruto"
        value={code}
        options={
         { readOnly: false}
        }
      />
    </>
  );
};

export default App;
