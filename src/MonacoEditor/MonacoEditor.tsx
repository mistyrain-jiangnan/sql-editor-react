/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react'
import * as monaco from 'monaco-editor'
import { editor, languages } from 'monaco-editor'
// 导入 codicon 字体
import codicon from 'monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf'

import { sqlAutoComplete, getDBSuggest, getTableSuggest, formatSQL } from './utils'
//@ts-ignore
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'

import { defineTheme } from './themo'
import { Toolbar } from './Toolbar' 

import type {  IDisposable } from 'monaco-editor'
import {  MonacoEditorProps, RefEditorInstance } from './types'

const { keywords } = sqlLanguage

// 空函数，用作默认值
function noop() {}





// 加载字体的异步函数
export async function loadFont(fontFamily: string, url: string): Promise<void> {
  const font = new FontFace(fontFamily, `local(${fontFamily}), url(${url})`)
  await font.load()
  document.fonts.add(font)
}
// 注册主题
defineTheme()
//默认编辑器配置
const defaultOptions: editor.IStandaloneEditorConstructionOptions & editor.IEditorScrollbarOptions = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  cursorStyle: 'line',
  readOnly: true,
  fontSize: 16,
  automaticLayout: true,
  minimap: {
    // 小地图配置
    enabled: false, // 禁用小地图
  },
}


// eslint-disable-next-line react-refresh/only-export-components
function MonacoEditor(props: MonacoEditorProps, ref: React.ForwardedRef<RefEditorInstance>) {
  const {
    width = '100%', // 默认宽度
    height = '100%', // 默认高度
    value = '', // 编辑器内容
    theme = 'naruto', // 主题
    language = 'sql', // 语言，默认 SQL
    autoComplete = sqlAutoComplete, // 默认sql自动补全
    options = {}, // 编辑器选项
    editorDidMount = noop, // 编辑器挂载后的回调
    onChange = noop, // 内容变化时的回调
    defaultValue = '', // 默认值
    dataBase = {}, //数据库表数据
    children, // 接收 children
    ...rest
  } = props

  // 设置语言和主题选项
  options.language = language || options.language
  options.theme = theme || options.theme

  // 合并默认选项和传入的选项
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }
  const [val, setVal] = useState(defaultValue) // 管理编辑器的内容
  const container = useRef<HTMLDivElement>() // 容器引用
  const containerRef = useRef<HTMLDivElement>(null)
  const $editor = useRef<editor.IStandaloneCodeEditor>() // 编辑器引用
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  // 定义 format 方法
  const format = () => {
    if ($editor.current) {
      $editor.current.setValue(formatSQL($editor.current.getValue()))
    }
  }
  const setReadOnly = (readOnly: boolean) => {
    if ($editor.current) {
      $editor.current.updateOptions({ readOnly })
    }
  }
  const quitFullScreen = () => {
    setIsFullScreen(false)
  }
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev)
  }
  const handleExitFullEdit = useCallback((e: KeyboardEvent) => {
    const CODE = 'Escape'
    if (e.code === CODE) {
      quitFullScreen()
    }
  }, [])

  // 暴露引用给父组件
  useImperativeHandle(ref, () => ({
    container: container.current || null,
    editor: $editor.current,
    monaco,
    format,
    toggleFullScreen, // 暴露 toggleFullScreen 方法
    setReadOnly,
  }))

  // 当 value 变化时更新状态
  useEffect(() => {
    setVal(value)
  }, [value])

  // 当 val 变化时更新编辑器内容  当主题选项变化时更新主题
  useEffect(() => {
    if ($editor.current && $editor.current.getValue() !== val) {
      $editor.current.setValue(val)
    }
    if (options.theme) {
      editor.setTheme(options.theme)
    }
  }, [val, options.theme])
  useEffect(() => {
    const editorInstance = $editor.current
    if (editorInstance) {
      const handleKeyUp = (event: KeyboardEvent) => {
        if (isFullScreen) {
          handleExitFullEdit(event)
        }
      }
      editorInstance.layout()
      window.addEventListener('keyup', handleKeyUp)
      return () => {
        window.removeEventListener('keyup', handleKeyUp)
      }
    }
    return undefined;
  }, [handleExitFullEdit, isFullScreen])
  // 组件卸载时销毁编辑器实例
  useEffect(() => {
    return () => {
      if ($editor.current) {
        $editor.current.dispose()
      }
      window.removeEventListener('keyup', handleExitFullEdit)
    }
  }, [])

  // 注册自动补全提供者
  useEffect(() => {
    let CPDisposable: IDisposable
    if ($editor.current && autoComplete) {
      const _model = $editor.current.getModel()
      const _position = $editor.current.getPosition()
      if (_model && _position) {
        CPDisposable = languages.registerCompletionItemProvider(language, {
          triggerCharacters: ['.', ...keywords],
          provideCompletionItems: (model, position) => {
            let suggestions: languages.CompletionItem[] = []
            const { lineNumber, column } = position
            /* 获取当前光标所在行的文本 */
            const beforeEditingText = model.getValueInRange({
              startLineNumber: lineNumber,
              startColumn: 0,
              endLineNumber: lineNumber,
              endColumn: column,
            })
            /* 正在编辑的单词 */
            const tokens = beforeEditingText.trim().split(/\s+/)
            const editingWord = tokens[tokens.length - 1]

            /* .结尾 */
            if (editingWord?.endsWith('.')) {
              const wordNoDot = editingWord.slice(0, editingWord.length - 1)
              if (Object.keys(dataBase).includes(wordNoDot)) {
                suggestions = [...getTableSuggest(dataBase, wordNoDot)]
              }
            } else if (editingWord === '.') {
              /* .开头 */
              suggestions = []
            } else {
              suggestions = [...getDBSuggest(dataBase), ...autoComplete(model, position)]
            }
            return {
              suggestions,
            }
          },
        })
      }
    }
    // 组件卸载时销毁自动补全提供者
    return () => {
      CPDisposable && CPDisposable.dispose()
    }
  }, [language, autoComplete, dataBase])

  // 当选项变化时更新编辑器选项
  useEffect(() => {
    if ($editor.current) {
      const optionsRaw = $editor.current.getRawOptions()
      ;(Object.keys(optionsRaw) as (keyof editor.IEditorOptions)[]).forEach((keyname) => {
        const propsOpt = options[keyname]
        if (optionsRaw[keyname] !== propsOpt && propsOpt !== undefined) {
          $editor.current!.updateOptions({ [keyname]: propsOpt })
        }
      })
    }
  }, [options])

  // 初始化编辑器实例
  const refElement = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      container.current = node
      $editor.current = editor.create(node, {
        value: val,
        language,
        ...mergedOptions,
      })
      // 添加 SQL 格式化菜单项
      $editor.current.addAction({
        id: 'format.sql',
        label: 'SQL 格式化',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1,
        run: function () {
          format()
        },
      })
      if (options.theme) {
        editor.setTheme(options.theme)
      }
      editorDidMount($editor.current, monaco)
      $editor.current.onDidChangeModelContent((event) => {
        const valueCurrent = $editor.current!.getValue()
        onChange(valueCurrent, event)
      })
      // 加载字体
      loadFont('codicon', codicon).catch((e) => {
        if (e) {
          console.error('Failed to load font codicon', e)
        }
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: isFullScreen ? '100vw' : width, // 100vw 确保在全屏时宽度为视口宽度
        height: isFullScreen ? '100vh' : height, // 100vh 确保在全屏时高度为视口高度
        position: isFullScreen ? 'fixed' : 'relative', // 固定定位在全屏时
        top: isFullScreen ? 0 : undefined,
        left: isFullScreen ? 0 : undefined,
        zIndex: isFullScreen ? 9999 : undefined, // 确保在全屏时覆盖其他内容
        marginBottom: 40,
      }}
    >
      <Toolbar
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        quitFullScreen={quitFullScreen}
      >
        {children}
      </Toolbar>
      <div
        {...rest}
        ref={refElement}
        style={{
          ...rest.style,
          width: isFullScreen ? '100vw' : width,
          height: isFullScreen ? '100vh' : height,
        }}
      />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.forwardRef<RefEditorInstance, MonacoEditorProps>(MonacoEditor)
