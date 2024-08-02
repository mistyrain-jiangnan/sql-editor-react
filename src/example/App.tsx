import { useRef, useState } from 'react'
import type { RefEditorInstance } from '../MonacoEditor/types'
import type { editor } from 'monaco-editor'
import type { FC } from 'react'

import MonacoEditor from '../MonacoEditor/MonacoEditor'
import React from 'react'

const App: FC = () => {
  const editorRef = useRef<RefEditorInstance>(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [code, setCode] = useState('SELECT * FROM users;')
  const options: editor.IStandaloneEditorConstructionOptions & editor.IEditorScrollbarOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line',
    automaticLayout: true,
  }
  const handleEditorChange = (newValue: string) => {
    setCode(newValue)
  }
  const editorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editor.focus()
  }
  const handleFormatSQL = () => {
    if (editorRef.current) {
      editorRef.current.format() // 调用暴露的 formatSQL 方法
    }
  }
  return (
    <>
      <button onClick={handleFormatSQL}>格式化 SQL</button> {/* 按钮触发格式化 */}
      <MonacoEditor
        ref={editorRef}
        height={800}
        value={code}
        theme="naruto"
        options={options}
        editorDidMount={(editor) => editorDidMount(editor)}
        onChange={handleEditorChange}
      />
    </>
  )
}
export default App
