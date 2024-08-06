import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { DiffEditorProps } from "./types";

import { noop, processSize } from "../utils";

import { narutoTheme } from "../index";

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions &
monaco.editor.IEditorScrollbarOptions = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  cursorStyle: "line",
  readOnly: true,
  fontSize: 14,
  scrollbar: {
    vertical: 'auto', // 初始滚动条设置
    horizontal: 'auto',
    verticalScrollbarSize: 10, // 设置垂直滚动条的宽度
    horizontalScrollbarSize: 10 // 设置水平滚动条的高度
  },
  minimap: {
    // 小地图配置
    enabled: false, // 禁用小地图
  },
  glyphMargin: true,
};

const DiffEditor: React.FC<DiffEditorProps> = ({
  width = "100%",
  height = "100%",
  value = "",
  defaultValue = "",
  language = "sql",
  theme = "naruto",
  options = {
   ... defaultOptions},
  overrideServices = {},
  editorWillMount = noop,
  editorDidMount = noop,
  editorWillUnmount = noop,
  onChange = noop,
  className,
  original = "",
  originalUri,
  modifiedUri,
  renderSideBySide = true,
}) => {
  narutoTheme();

  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const subscription = useRef<monaco.IDisposable | null>(null);
  const preventTriggerChangeEvent = useRef<boolean>(false);

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);

  const style = useMemo(
    () => ({ width: fixedWidth, height: fixedHeight }),
    [fixedWidth, fixedHeight]
  );

  const handleEditorWillMount = () => {
    const finalOptions = editorWillMount(monaco);
    return finalOptions || {};
  };

  const handleEditorDidMount = () => {
    if (editor.current) {
      editorDidMount(editor.current, monaco);
      const model = editor.current.getModel();
      if (model) {
        const { modified } = model;
        subscription.current = modified.onDidChangeContent(
          (event: monaco.editor.IModelContentChangedEvent) => {
            if (!preventTriggerChangeEvent.current) {
              onChange(modified.getValue(), event);
            }
          }
        );
      }
    }
  };

  const handleEditorWillUnmount = () => {
    if (editor.current) {
      editorWillUnmount(editor.current, monaco);
    }
  };

  const initModels = () => {
    if (editor.current) {
      const finalValue = value ?? defaultValue;
      const originalModelUri = originalUri?.(monaco);
      const modifiedModelUri = modifiedUri?.(monaco);
      let originalModel = originalModelUri
        ? monaco.editor.getModel(originalModelUri)
        : null;
      let modifiedModel = modifiedModelUri
        ? monaco.editor.getModel(modifiedModelUri)
        : null;

      if (originalModel) {
        originalModel.setValue(original);
        monaco.editor.setModelLanguage(originalModel, language);
      } else {
        originalModel = monaco.editor.createModel(
          original,
          language,
          originalModelUri
        );
      }

      if (modifiedModel) {
        modifiedModel.setValue(finalValue);
        monaco.editor.setModelLanguage(modifiedModel, language);
      } else {
        modifiedModel = monaco.editor.createModel(
          finalValue,
          language,
          modifiedModelUri
        );
      }

      editor.current.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    }
  };

  useEffect(() => {
    if (containerElement.current) {
      const finalOptions = handleEditorWillMount();
      editor.current = monaco.editor.createDiffEditor(
        containerElement.current,
        {
          ...finalOptions,
          ...(className ? { extraEditorClassName: className } : {}),
          ...options,
          ...(theme ? { theme } : {}),
          renderSideBySide: renderSideBySide,
          enableSplitViewResizing:true
        },
        overrideServices
      );
      initModels();
      handleEditorDidMount();
    }

    return () => {
      handleEditorWillUnmount();
      if (editor.current) {
        editor.current.dispose();
        const { original: originalEditor, modified } =
          editor.current.getModel() || {};
        originalEditor?.dispose();
        modified?.dispose();
      }
      subscription.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderSideBySide]);

  useEffect(() => {
    if (editor.current) {
      editor.current.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...options,
      });
    }
  }, [className, options]);

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      if (model) {
        const { original: originalEditor, modified } = model;
        monaco.editor.setModelLanguage(originalEditor, language);
        monaco.editor.setModelLanguage(modified, language);
      }
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      const { modified } = editor.current.getModel() || {};
      preventTriggerChangeEvent.current = true;
      editor.current.getModifiedEditor().pushUndoStop();
      modified?.pushEditOperations(
        [],
        [
          {
            range: modified?.getFullModelRange(),
            text: value,
          },
        ],
        () => []
      );
      editor.current.getModifiedEditor().pushUndoStop();
      preventTriggerChangeEvent.current = false;
    }
  }, [value]);

  useEffect(() => {
    if (theme) {
      monaco.editor.setTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (editor.current) {
      const { original: originalEditor } = editor.current.getModel() ?? {};
      if (original !== originalEditor?.getValue()) {
        originalEditor?.setValue(original);
      }
    }
  }, [original]);

  return (
    <div
      ref={containerElement}
      style={style}
      className="react-monaco-editor-container"
    />
  );
};

DiffEditor.displayName = "DiffEditor";

export default DiffEditor;
