import MonacoEditor from './MonacoEditor'

export * from './MonacoEditor/types';
// 具名导出：
export { MonacoEditor };
export default MonacoEditor;

  // Monaco
  import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
  export type Monaco = typeof monaco;
  
  // Default themes
  export type Theme = 'vs-dark' | 'light';