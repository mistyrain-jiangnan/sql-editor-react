import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { ReactNode } from "react";
import { MonacoEditorBaseProps } from "../types";

export type IMonacoEditor = typeof monacoEditor;

export type EditorConstructionOptions = NonNullable<
  Parameters<typeof monacoEditor.editor.create>[1]
>;

export type EditorWillMount = (
  monaco: typeof monacoEditor,
) => void | EditorConstructionOptions;

export type EditorDidMount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor,
) => void;

export type EditorWillUnmount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor,
) => void | EditorConstructionOptions;

export type ChangeHandler = (
  value: string,
  event: monacoEditor.editor.IModelContentChangedEvent,
) => void;

// 引用实例的类型定义
export interface RefEditorInstance {
  container: HTMLDivElement | null;
  editor?: monacoEditor.editor.IStandaloneCodeEditor;
  monaco: IMonacoEditor;
  format: () => void; // 暴露 formatSQL 方法
  setReadOnly: (value: boolean) => void;
}
// 定义组件的属性类型
export interface MonacoEditorProps
  extends MonacoEditorBaseProps  {
  value?: string;
  dataBase?: Record<string, string[]>;
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;
  autoComplete?: (
    model: monacoEditor.editor.ITextModel,
    position: monacoEditor.Position
  ) => monacoEditor.languages.CompletionItem[];
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;
  editorWillMount?: EditorWillMount;
  editorWillUnmount?: EditorWillUnmount;
  editorDidMount?: EditorDidMount;
  onChange?: ChangeHandler;
  children?: ReactNode; // 允许传递子组件
}
// Monaco
export type Monaco = typeof monacoEditor;

// Default themes
export type Theme = "vs-dark" | "light";


