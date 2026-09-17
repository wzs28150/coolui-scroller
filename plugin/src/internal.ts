/** 内部模块出口，供 scripts/smoke.mjs 做冒烟测试（不参与发布） */
export { WxmlCompletionProvider } from './providers/completion'
export { WxmlHoverProvider } from './providers/hover'
export { JsonCompletionProvider } from './providers/jsonCompletion'
export { MissingImportDiagnostics, AddMissingImportAction } from './providers/diagnostics'
export { TagResolver, jsonFilesFor } from './tags'
export { allComponents, findComponentByTag, findComponentByPath, tagSuggestions } from './meta'
export * as jsonEdit from './utils/jsonEdit'
export {
  getWxmlContext,
  getOpenTagStack,
  getParentTag,
  getWordRangeAt,
  isVueDocument,
  platformOf,
} from './utils/wxml'
export { insertComponent, addUsingComponentsCommand, openDocs } from './commands'
export { activate } from './extension'
