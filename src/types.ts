export * from './Editor/types';

export * from './DiffEditor/types';

export interface MonacoEditorBaseProps  {
    /**
     * Width of editor. Defaults to 100%.
     */
    width?: string | number;
  
    /**
     * Height of editor. Defaults to 100%.
     */
    height?: string | number;
  
    /**
     * The initial value of the auto created model in the editor.
     */
    defaultValue?: string;
  
    /**
     * The initial language of the auto created model in the editor. Defaults to 'javascript'.
     */
    language?: string;
  
    /**
     * Theme to be used for rendering.
     * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
     * You can create custom themes via `monaco.editor.defineTheme`.
     */
    theme?: string | null;
  
    /**
     * Optional string classname to append to the editor.
     */
    className?: string | null;
  }
  

import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

export type Editor =typeof editor