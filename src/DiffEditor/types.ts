import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { MonacoEditorBaseProps ,ChangeHandler} from "../types";


export type DiffEditorWillMount = (
  monaco: typeof monacoEditor
) => void | monacoEditor.editor.IStandaloneEditorConstructionOptions;

export type DiffEditorDidMount = (
  editor: monacoEditor.editor.IStandaloneDiffEditor,
  monaco: typeof monacoEditor
) => void;

export type DiffEditorWillUnmount = (
  editor: monacoEditor.editor.IStandaloneDiffEditor,
  monaco: typeof monacoEditor
) => void;

export type DiffChangeHandler = ChangeHandler;

export interface DiffEditorProps extends MonacoEditorBaseProps {
  /**
   * The original value to compare against.
   */
  original?: string;

  /**
   * Value of the auto created model in the editor.
   * If you specify value property, the component behaves in controlled mode. Otherwise, it behaves in uncontrolled mode.
   */
  value?: string;

  /**
   * Refer to Monaco interface {monaco.editor.IDiffEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IDiffEditorConstructionOptions;

  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;


  renderSideBySide?:boolean;

  /**
   * An event emitted before the editor mounted (similar to componentWillMount of React).
   */
  editorWillMount?: DiffEditorWillMount;

  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  editorDidMount?: DiffEditorDidMount;

  /**
   * An event emitted before the editor unmount (similar to componentWillUnmount of React).
   */
  editorWillUnmount?: DiffEditorWillUnmount;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: DiffChangeHandler;

  /**
   * Let the language be inferred from the uri
   */
  originalUri?: (monaco: typeof monacoEditor) => monacoEditor.Uri;

  /**
   * Let the language be inferred from the uri
   */
  modifiedUri?: (monaco: typeof monacoEditor) => monacoEditor.Uri;
}
