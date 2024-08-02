# `index.tsx` 使用指南

该文档将指导您如何在 React 组件中使用 `MonacoEditor` 组件

## 1. 导入依赖

首先，您需要从相关库中导入必要的依赖：

```typescript
import { useRef, useState } from 'react'

import type { RefEditorInstance } from '@/components/MonacoEditor'
import type { editor } from 'monaco-editor'
import type { FC } from 'react'

import MonacoEditor from '@/components/MonacoEditor'
