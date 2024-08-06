import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const narutoTheme = () => {
  monaco.editor.defineTheme('naruto', {
    base: 'vs', // 以哪个默认主题为基础："vs" | "vs-dark" | "hc-black" | "hc-light"
    inherit: true,
    rules: [
      // 高亮规则，即给代码里不同token类型的代码设置不同的显示样式
      { token: 'identifier', foreground: '#d06733' },
      { token: 'number', foreground: '#6bbeeb', fontStyle: 'italic' },
      { token: 'keyword', foreground: '#05a4d5' },
    ],
    colors: {
      'scrollbarSlider.background': '#bcbcbc', // 滚动条背景
      'editorCursor.foreground': '#d4b886', // 焦点颜色
      'editor.lineHighlightBackground': '#6492a520', // 焦点所在的一行的背景颜色
      'editorLineNumber.foreground': '#008800', // 行号字体颜色
      'editorLineNumber.background': '#333333',
      'editorGutter.background': '#f5f6f7',
    },
  })
}
