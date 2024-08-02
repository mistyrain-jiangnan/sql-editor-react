import * as monaco from 'monaco-editor'

import type { languages } from 'monaco-editor'

import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import { format } from 'sql-formatter'

const { keywords } = sqlLanguage

// sql自动补全关键字
export const sqlAutoComplete = () => {
  const suggestions: languages.CompletionItem[] = keywords.map((item: string) => ({
    label: item,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: `${item} `,
    detail: '内置关键字',
  }))
  return suggestions
}

// 数据库名
export const getDBSuggest = (dataBase: Record<string, string[]>) => {
  const suggestions = Object.keys(dataBase).map((key) => ({
    label: key,
    kind: monaco.languages.CompletionItemKind.Constant,
    insertText: key,
    detail: '数据库',
  }))
  return suggestions as languages.CompletionItem[]
}

// 获取表名
export const getTableSuggest = (hintData: Record<string, string[]>, dbName: string) => {
  const tableNames = hintData[dbName]
  if (!tableNames) {
    return []
  }
  const suggestions = tableNames.map((name: string) => ({
    label: name,
    kind: monaco.languages.CompletionItemKind.Constant,
    insertText: name,
    detail: '表',
  }))
  return suggestions as languages.CompletionItem[]
}
// 格式化 SQL
export const formatSQL = (sql: string): string => {
  return format(sql)
}
