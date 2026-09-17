import * as fs from 'node:fs'
import * as path from 'node:path'
import * as vscode from 'vscode'
import { ComponentMeta, Platform } from './types'
import { findComponentByPath, findComponentByTag, importPathOf } from './meta'
import { config } from './utils/config'
import { addUsingComponents, readUsingComponents } from './utils/jsonEdit'
import { isVueDocument } from './utils/wxml'

export interface DocumentTags {
  /** 已在 json 的 usingComponents 里声明的 tag -> 组件 */
  declared: Map<string, ComponentMeta>
  /** tag 声明所在的 json 文件 */
  declaredIn: Map<string, string>
  /** 适合写入新引入的 json 文件 */
  targetJson?: string
  /** 参与解析的 json 文件 */
  jsonFiles: string[]
}

function isFile(file: string): boolean {
  try {
    return fs.statSync(file).isFile()
  } catch {
    return false
  }
}

/** 向上查找小程序根目录的 app.json */
function findAppJson(startDir: string): string | undefined {
  let dir = startDir
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, 'app.json')
    if (isFile(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return undefined
}

/** 影响某个文档 usingComponents 的 json 文件：同目录同名 json + app.json */
export function jsonFilesFor(document: vscode.TextDocument): { jsonFiles: string[]; targetJson?: string } {
  const filePath = document.uri.fsPath
  const dir = path.dirname(filePath)
  const base = path.basename(filePath, path.extname(filePath))
  const sibling = path.join(dir, `${base}.json`)
  const hasSibling = isFile(sibling)
  const appJson = findAppJson(dir)
  const jsonFiles: string[] = []
  if (hasSibling) jsonFiles.push(sibling)
  if (appJson && appJson !== sibling) jsonFiles.push(appJson)
  return { jsonFiles, targetJson: hasSibling ? sibling : appJson }
}

/** 已声明的标签优先，其次回退到组件自身的标签名 / 别名索引；可限定平台 */
export function resolveComponent(
  tags: DocumentTags,
  tagName?: string,
  platform?: Platform
): ComponentMeta | undefined {
  if (!tagName) return undefined
  const comp = tags.declared.get(tagName) || findComponentByTag(tagName)
  if (comp && platform && comp.platform !== platform) return undefined
  return comp
}

export class TagResolver {
  private readonly cache = new Map<string, { mtime: number; using: Map<string, string> }>()

  private load(file: string): Map<string, string> {
    let mtime = 0
    try {
      mtime = fs.statSync(file).mtimeMs
    } catch {
      return new Map()
    }
    const hit = this.cache.get(file)
    if (hit && hit.mtime === mtime) return hit.using
    const using = readUsingComponents(fs.readFileSync(file, 'utf8'))
    this.cache.set(file, { mtime, using })
    return using
  }

  invalidate(file?: string): void {
    if (file) this.cache.delete(file)
    else this.cache.clear()
  }

  resolve(document: vscode.TextDocument): DocumentTags {
    if (isVueDocument(document)) return this.resolveVue(document)
    const { jsonFiles, targetJson } = jsonFilesFor(document)
    const declared = new Map<string, ComponentMeta>()
    const declaredIn = new Map<string, string>()
    for (const file of jsonFiles) {
      for (const [tag, ref] of this.load(file)) {
        const comp = findComponentByPath(ref, config.packageName)
        if (!comp) continue
        if (!declared.has(tag)) declared.set(tag, comp)
        if (!declaredIn.has(tag)) declaredIn.set(tag, file)
      }
    }
    return { declared, declaredIn, targetJson, jsonFiles }
  }

  /** uni-app：解析 <script> 里的 import 与 components 注册，建立别名映射 */
  private resolveVue(document: vscode.TextDocument): DocumentTags {
    const text = document.getText()
    const script = (text.match(/<script[^>]*>([\s\S]*?)<\/script>/) || [])[1] || ''
    const declared = new Map<string, ComponentMeta>()
    const declaredIn = new Map<string, string>()
    const importMap = new Map<string, ComponentMeta>()

    const importRe = /import\s+([\w$]+)\s+from\s+['"]([^'"]+)['"]/g
    let m: RegExpExecArray | null
    while ((m = importRe.exec(script))) {
      const local = m[1]
      const ref = m[2]
      if (!/coolui-scroller/.test(ref)) continue
      const comp =
        findComponentByPath(ref, config.packageName) || findComponentByPath(ref, config.uniappPackageName)
      if (comp) importMap.set(local, comp)
    }

    const register = (tag: string, comp: ComponentMeta) => {
      if (!tag || declared.has(tag)) return
      declared.set(tag, comp)
      declaredIn.set(tag, document.uri.fsPath)
    }

    // components: { Name } / { Alias: Name }（含 defineOptions）
    const compRe = /components\s*:\s*\{([\s\S]*?)\}/g
    let cm: RegExpExecArray | null
    while ((cm = compRe.exec(script))) {
      for (const entry of cm[1].split(',')) {
        const pair = entry.split(':')
        const key = (pair[0] || '').trim().replace(/['"]/g, '')
        const value = (pair[1] || pair[0] || '').trim()
        const comp = importMap.get(value)
        if (comp) register(key, comp)
      }
    }

    // 直接 import 的本地名同样可作为标签
    for (const [local, comp] of importMap) register(local, comp)

    return { declared, declaredIn, jsonFiles: [], targetJson: undefined }
  }

  /** 把缺失的组件写进目标 json */
  addToJson(file: string, comp: ComponentMeta, tag?: string): boolean {
    const text = fs.readFileSync(file, 'utf8')
    const updated = addUsingComponents(text, [{ tag: tag || comp.tag, path: importPathOf(comp) }])
    if (!updated) return false
    fs.writeFileSync(file, updated, 'utf8')
    this.invalidate(file)
    return true
  }
}
