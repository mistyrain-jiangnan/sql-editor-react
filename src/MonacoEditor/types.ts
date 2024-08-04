import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { ReactNode } from "react";

export type IMonacoEditor = typeof monaco;

// 引用实例的类型定义
export interface RefEditorInstance {
  container: HTMLDivElement | null;
  editor?: editor.IStandaloneCodeEditor;
  monaco: IMonacoEditor;
  format: () => void; // 暴露 formatSQL 方法
  setReadOnly: (value: boolean) => void;
}
// 定义组件的属性类型
export interface MonacoEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  width?: number | string;
  height?: number | string;
  value?: string;
  defaultValue?: string;
  dataBase?: Record<string, string[]>;
  language?: editor.IStandaloneEditorConstructionOptions["language"];
  autoComplete?: (
    model: editor.ITextModel,
    position: monaco.Position
  ) => monaco.languages.CompletionItem[];
  theme?: editor.IStandaloneEditorConstructionOptions["theme"];
  options?: editor.IStandaloneEditorConstructionOptions;
  editorDidMount?: (
    editor: editor.IStandaloneCodeEditor,
    monaco: IMonacoEditor
  ) => void;
  onChange?: (value: string, event: editor.IModelContentChangedEvent) => void;
  children?: ReactNode; // 允许传递子组件
}

// Monaco
export type Monaco = typeof monaco;

// Default themes
export type Theme = "vs-dark" | "light";
