
# sql-editor-react

### 安装

```bash
npm install sql-editor-react
```

or

```bash
yarn add sql-editor-react
```

### 使用

```javascript
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
```

```typescript
// 引用实例的类型定义
export interface RefEditorInstance {
    container: HTMLDivElement | null
    editor?: editor.IStandaloneCodeEditor
    monaco: IMonacoEditor
    format: () => void // 暴露 formatSQL 方法
    setReadOnly: (value: boolean) => void
  }
// 定义组件的属性类型
export interface MonacoEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    width?: number | string
    height?: number | string
    value?: string
    defaultValue?: string
    dataBase?: Record<string, string[]> //支持数据库 表名
    language?: editor.IStandaloneEditorConstructionOptions['language']
    autoComplete?: (model: editor.ITextModel, position: monaco.Position) => monaco.languages.CompletionItem[]
    theme?: editor.IStandaloneEditorConstructionOptions['theme']
    options?: editor.IStandaloneEditorConstructionOptions //继承MonacoEditor options属性
    editorDidMount?: (editor: editor.IStandaloneCodeEditor, monaco: IMonacoEditor) => void
    onChange?: (value: string, event: editor.IModelContentChangedEvent) => void
    children?: ReactNode  //传递过来的Toolbar 组件 默认支持全屏
  }
 export type Monaco = typeof monaco;
 export type Theme = 'vs-dark' | 'light';
```
