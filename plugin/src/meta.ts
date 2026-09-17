import { ComponentMeta, MetaData, Platform } from './types'

/** 元数据索引与查询，数据来自 scripts/extract-metadata.mjs 生成的 JSON */
import raw from './data/components.json'

export const metaData = raw as unknown as MetaData

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const byKey = new Map<string, ComponentMeta>()
const byImportPath = new Map<string, ComponentMeta>()
const byName = new Map<string, ComponentMeta>()

function nameVariants(name: string): string[] {
  const lower = name.toLowerCase()
  const set = new Set<string>([name, lower, kebab(name), kebab(lower), lower.replace(/[-_]/g, '')])
  return [...set].filter(Boolean)
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function index(): void {
  if (byKey.size) return
  const sorted = [...metaData.components].sort((a, b) => a.key.length - b.key.length)
  for (const comp of sorted) {
    byKey.set(comp.key, comp)
    byImportPath.set(comp.importPath, comp)
  }
  // 短的 key 先注册，避免 <refresh> 被 second-floor-refresh 之类的名字抢占
  for (const comp of sorted) {
    for (const name of [comp.tag, ...comp.aliases]) {
      for (const variant of nameVariants(name)) {
        if (!byName.has(variant)) byName.set(variant, comp)
      }
    }
  }
}

/** 所有组件，可按平台过滤 */
export function allComponents(platform?: Platform): ComponentMeta[] {
  index()
  return platform ? metaData.components.filter((c) => c.platform === platform) : metaData.components
}

/** 按标签名查找（忽略大小写、连字符差异） */
export function findComponentByTag(tag: string): ComponentMeta | undefined {
  index()
  if (!tag) return undefined
  return byName.get(tag) || byName.get(tag.toLowerCase()) || byName.get(tag.toLowerCase().replace(/[-_]/g, ''))
}

/** 按 usingComponents 里的路径反查组件，支持相对路径 */
export function findComponentByPath(ref: string, packageName?: string): ComponentMeta | undefined {
  index()
  const pkg = packageName || metaData.packageName
  const clean = ref.replace(/\\/g, '/').trim()
  if (byImportPath.has(clean)) return byImportPath.get(clean)

  let p = clean.replace(new RegExp(`^${escapeRegExp(pkg)}/`), '')
  p = p.replace(/^\.\.?\//, '')
  const direct = [p, p.replace(/\/index$/, ''), p.replace(/\/$/, '')]
  for (const candidate of direct) {
    const hit = byKey.get(candidate)
    if (hit) return hit
  }
  // 逐级后缀匹配：'../packages/native/scroller/index' -> 'scroller/index' -> 'scroller'
  const parts = p.split('/')
  for (let i = 0; i < parts.length; i++) {
    const sub = parts.slice(i).join('/')
    const cleaned = sub.replace(/\.vue$/, '')
    const candidates = [sub, sub.replace(/\/index$/, ''), cleaned]
    // uni-app 的 xxx/xxx.vue 结构 -> 取目录名
    const segs = cleaned.split('/')
    if (segs.length >= 2 && segs[segs.length - 1] === segs[segs.length - 2]) {
      candidates.push(segs[segs.length - 1])
    }
    for (const candidate of candidates) {
      const hit = byKey.get(candidate)
      if (hit) return hit
    }
  }
  return undefined
}

/** 标签补全候选：推荐标签名 + 别名，可按平台过滤 */
export function tagSuggestions(platform?: Platform): { label: string; comp: ComponentMeta }[] {
  index()
  const seen = new Set<string>()
  const list: { label: string; comp: ComponentMeta }[] = []
  for (const comp of allComponents(platform)) {
    for (const name of [comp.tag, ...comp.aliases]) {
      const key = name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      list.push({ label: name, comp })
    }
  }
  return list.sort((a, b) => a.label.localeCompare(b.label))
}

/** 生成组件的引入路径（uni-app 版返回 .vue 文件路径） */
export function importPathOf(comp: ComponentMeta, packageName?: string): string {
  const base =
    comp.platform === 'uniapp' ? metaData.uniappPackageName || 'coolui-scroller-uni' : metaData.packageName
  const pkg = packageName || base
  return comp.importPath.replace(new RegExp(`^${escapeRegExp(base)}/`), `${pkg}/`)
}
