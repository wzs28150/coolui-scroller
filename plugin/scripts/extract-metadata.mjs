/**
 * 从 coolui-scroller 组件源码与文档中生成 VSCode 扩展需要的元数据。
 *
 * 数据来源（单一真源，避免手工维护两份）:
 *   1. packages/native/<comp>/index.js  -> properties / externalClasses / triggerEvent / relations
 *   2. packages/native/<comp>/index.wxml -> <slot name="xxx">
 *   3. doc/native/components/*.md       -> 中文说明、类型、默认值、版本、废弃标记
 *   4. demo/native/**\/*.json           -> usingComponents 的真实标签名（别名）
 *
 * 输出: src/data/components.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')
const OUTPUT = path.resolve(__dirname, '../src/data/components.json')

const COMPONENTS_DIR = path.join(ROOT, 'packages/native')
const UNIAPP_DIR = path.join(ROOT, 'packages/uniapp/components')
const DOCS_DIR = path.join(ROOT, 'doc/native/components')
const DEMO_DIR = path.join(ROOT, 'demo/native')

const UNIAPP_DOCS_DIR = path.join(ROOT, 'doc/uniapp/components')
const UNIAPP_TYPES_FILE = path.join(ROOT, 'packages/uniapp/types.d.ts')
const UNIAPP_PACKAGE_NAME = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'packages/uniapp/package.json'), 'utf8')
).name

const PACKAGE_NAME = 'coolui-scroller'

/* ------------------------------------------------------------------ *
 * 通用遍历
 * ------------------------------------------------------------------ */

function walk(dir, exts) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, exts))
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full)
  }
  return out
}

/* ------------------------------------------------------------------ *
 * JS 源码解析（小程序 Component() 定义）
 * ------------------------------------------------------------------ */

/** 从 balance 起始符读取一段平衡的 {}/[]/()，返回 { end, inner } */
function readBalanced(src, start) {
  const pairs = { '{': '}', '[': ']', '(': ')' }
  const open = src[start]
  const close = pairs[open]
  if (!close) return null
  let depth = 0
  let str = null
  let i = start
  while (i < src.length) {
    const ch = src[i]
    if (str) {
      if (ch === '\\') {
        i += 2
        continue
      }
      if (ch === str) str = null
      i++
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      str = ch
      i++
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i)
      i = nl === -1 ? src.length : nl + 1
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end === -1 ? src.length : end + 2
      continue
    }
    if (ch === open) depth++
    else if (ch === close && --depth === 0) return { end: i, inner: src.slice(start + 1, i) }
    i++
  }
  return null
}

/** 读取一个值（可能是平衡块，或是到顶级逗号/行尾结束的表达式） */
function readValue(src, start) {
  if (start >= src.length) return { raw: '', end: start }
  const first = src[start]
  if (first === '{' || first === '[' || first === '(') {
    const b = readBalanced(src, start)
    if (b) return { raw: b.inner, end: b.end + 1, block: first }
  }
  let i = start
  let str = null
  let depth = 0
  const pushDown = '{[('
  const popUp = '}])'
  while (i < src.length) {
    const ch = src[i]
    if (str) {
      if (ch === '\\') {
        i += 2
        continue
      }
      if (ch === str) str = null
      i++
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      str = ch
      i++
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i)
      i = nl === -1 ? src.length : nl + 1
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end === -1 ? src.length : end + 2
      continue
    }
    if (pushDown.includes(ch)) depth++
    else if (popUp.includes(ch)) {
      if (depth === 0) break
      depth--
    } else if (ch === ',' && depth === 0) break
    else if (ch === '\n' && depth === 0) break
    i++
  }
  return { raw: src.slice(start, i).trim(), end: i }
}

/** 提取对象字面量里的顶层成员，返回 [{ key, raw, block }] */
function parseMembers(inner) {
  const members = []
  const re = /(?:^|[,{}\n])\s*([A-Za-z_$][\w$]*|'[^'\n]*'|"[^"\n]*")\s*:/g
  let m
  while ((m = re.exec(inner))) {
    const key = m[1].replace(/^['"]|['"]$/g, '')
    let valueStart = m.index + m[0].length
    while (valueStart < inner.length && /\s/.test(inner[valueStart])) valueStart++
    const v = readValue(inner, valueStart)
    members.push({ key, raw: v.raw, block: v.block || null })
    re.lastIndex = Math.max(re.lastIndex, v.end)
  }
  return members
}

/** 在源码中查找顶层对象块（Component({ xxx: {...} })） */
function findTopLevelBlock(src, key) {
  const re = new RegExp(`(?:^|[,{}\\n])\\s*${key}\\s*:`, 'g')
  let m
  while ((m = re.exec(src))) {
    const idx = m.index + m[0].length
    const i = idx + src.slice(idx).search(/\S/)
    if (src[i] === '{' || src[i] === '[') {
      const b = readBalanced(src, i)
      if (b) return b.inner
    }
  }
  return null
}

const TYPE_MAP = { String: 'string', Number: 'number', Boolean: 'boolean', Array: 'array', Object: 'object' }

function minify(raw) {
  let out = ''
  let str = null
  let prevSpace = false
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (str) {
      out += ch
      if (ch === '\\' && i + 1 < raw.length) out += raw[++i]
      else if (ch === str) str = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      str = ch
      prevSpace = false
      out += ch
      continue
    }
    if (ch === '/' && raw[i + 1] === '/') {
      const nl = raw.indexOf('\n', i)
      i = nl === -1 ? raw.length : nl
      continue
    }
    if (ch === '/' && raw[i + 1] === '*') {
      const end = raw.indexOf('*/', i + 2)
      i = end === -1 ? raw.length : end + 1
      continue
    }
    if (/\s/.test(ch)) {
      if (!prevSpace && out.length) {
        out += ' '
        prevSpace = true
      }
      continue
    }
    prevSpace = false
    out += ch
  }
  return out.replace(/,$/, '').trim()
}

function normalizeDefault(raw) {
  if (raw === undefined || raw === null) return undefined
  const text = minify(raw)
  if (!text) return undefined
  if (/^'[^']*'$/.test(text)) return text.slice(1, -1)
  if (/^"[^"]*"$/.test(text)) return text.slice(1, -1)
  return text
}

function parseComponentJs(file) {
  const src = fs.readFileSync(file, 'utf8')
  const result = { props: [], events: [], externalClasses: [], relations: [], methods: [] }

  const propsInner = findTopLevelBlock(src, 'properties')
  if (propsInner) {
    for (const member of parseMembers(propsInner)) {
      if (/^(properties|methods|data|relations|lifetimes|observers)$/.test(member.key)) continue
      const detail = member.block === '{' ? Object.fromEntries(parseMembers(member.raw).map((p) => [p.key, p.raw])) : {}
      const typeName = detail.type ? minify(detail.type) : ''
      result.props.push({
        name: member.key,
        type: TYPE_MAP[typeName] || typeName || 'any',
        default: normalizeDefault(detail.value),
      })
    }
  }

  const externalInner = findTopLevelBlock(src, 'externalClasses')
  if (externalInner) {
    for (const m of externalInner.matchAll(/['"]([^'"]+)['"]/g)) result.externalClasses.push(m[1])
  }

  for (const m of src.matchAll(/triggerEvent\(\s*['"]([\w-]+)['"]/g)) {
    if (!result.events.some((e) => e.name === m[1])) result.events.push({ name: m[1], desc: '' })
  }

  const relationsInner = findTopLevelBlock(src, 'relations')
  if (relationsInner) {
    for (const m of relationsInner.matchAll(/['"](\.\.?\/[\w./-]+)['"]/g)) {
      const target = path.normalize(m[1]).replace(/\\/g, '/')
      const name = target.split('/').slice(-2)[0]
      if (!result.relations.includes(name)) result.relations.push(name)
    }
  }

  const methodsInner = findTopLevelBlock(src, 'methods')
  if (methodsInner) {
    for (const member of parseMembers(methodsInner)) {
      if (member.block === '(') {
        const arrow = /^\s*\(?[^)]*\)?\s*=>/.test(member.raw)
        const fn = /^\s*function/.test(member.raw)
        if (arrow || fn) result.methods.push({ name: member.key, desc: '' })
      }
    }
  }

  return result
}

/* ------------------------------------------------------------------ *
 * WXML 解析
 * ------------------------------------------------------------------ */

function parseSlots(file) {
  const src = fs.readFileSync(file, 'utf8')
  const slots = []
  for (const m of src.matchAll(/<slot\b([^>]*)>/g)) {
    const attrs = m[1]
    const nameMatch = attrs.match(/name\s*=\s*["']([^"']+)["']/)
    const name = nameMatch ? nameMatch[1] : 'default'
    if (!slots.some((s) => s.name === name)) slots.push({ name, desc: '' })
  }
  return slots
}

/* ------------------------------------------------------------------ *
 * Markdown 文档解析
 * ------------------------------------------------------------------ */

const MD_OF_COMPONENT = {
  scroller: 'scroller',
  refresh: 'refresh',
  parallax: 'parallax',
  empty: 'empty',
  item: 'item',
  loadmore: 'loadmore',
  handtip: 'handtip',
  nav: 'nav',
  'nav-pannel': 'navPannel',
  'nav-bar': 'nav',
  search: 'search',
  'scroll-page': 'page',
  secondFloor: 'floor',
  'second-floor': 'floor',
  'second-floor-refresh': 'floor',
  'backToTop': 'backToTop',
  'sort/index': 'sort',
  'sort/item': 'sort',
}

function cleanCell(cell) {
  return cell.replace(/`/g, '').replace(/<br\s*\/?>/gi, ' ').trim()
}

/** 说明里用反引号标出的取值列表，可作为属性值补全的候选 */
function extractEnumValues(desc) {
  const codes = [...desc.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim()).filter(Boolean)
  // 至少两个取值，且说明里存在分隔符，避免把普通代码引用当取值
  if (codes.length < 2 || !/[/、，|]|或/.test(desc)) return undefined
  const values = codes.filter(
    (v) => v.length <= 24 && !/[\s{}()[\],/;:-]/.test(v) && !/^[\d.]+$/.test(v)
  )
  const uniq = [...new Set(values)]
  return uniq.length >= 2 && uniq.length <= 8 ? uniq : undefined
}

/** 文档里用「默认」表示默认插槽 */
function normalizeSlotName(value) {
  const name = (value || '').trim()
  return name === '默认' ? 'default' : name
}

function stripDeprecated(name) {
  if (/^~~.*~~$/.test(name)) return { name: name.replace(/~~/g, '').trim(), deprecated: true }
  return { name: name.trim(), deprecated: false }
}

function parseDoc(file) {
  const src = fs.readFileSync(file, 'utf8')
  const title = (src.match(/^#\s+(.+)$/m) || [])[1] || ''
  const lines = src.split(/\r?\n/)

  const tables = []
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].trim()
    if (!row.startsWith('|')) continue
    const next = (lines[i + 1] || '').trim()
    if (!/^\|[\s:|-]+\|$/.test(next)) continue
    const header = row.slice(1, -1).split('|').map((c) => cleanCell(c))
    const rows = []
    const rawRows = []
    for (let j = i + 2; j < lines.length; j++) {
      const r = lines[j].trim()
      if (!r.startsWith('|')) break
      const raw = r.slice(1, -1).split('|')
      const cells = raw.map((c) => cleanCell(c))
      if (cells.length) {
        rows.push(cells)
        rawRows.push(raw)
      }
      i = j
    }
    tables.push({ header, rows, rawRows })
  }

  const props = new Map()
  const events = new Map()
  const methods = new Map()
  const slots = new Map()
  const extraClasses = new Map()

  for (const { header, rows, rawRows } of tables) {
    const head = header.join('|')
    const first = header[0] || ''
    if (first.includes('属性') || first.includes('参数')) {
      rows.forEach((cells, idx) => {
        const { name, deprecated } = stripDeprecated(cells[0] || '')
        if (!name || name === '参数') return
        props.set(name, {
          name,
          desc: cells[1] || '',
          type: cells[2] ? cells[2].replace(/_/g, '') : '',
          default: cells[3] || '',
          version: cells[4] || '',
          deprecated,
          enum: extractEnumValues(rawRows[idx][1] || ''),
        })
      })
    } else if (first.includes('事件')) {
      // uni-app 文档事件表：| 事件 | 说明 | 参数 |
      for (const cells of rows) {
        const raw = (cells[0] || '').trim()
        if (!raw || raw === '事件') continue
        for (const name of raw.split(/\s*\/\s*/).filter(Boolean)) {
          events.set(name, { name, usage: '', desc: cells[1] || '', detail: cells[2] || '', version: '' })
        }
      }
    } else if (first.includes('插槽')) {
      // uni-app 文档插槽表：| 插槽 | 说明 |
      for (const cells of rows) {
        const name = normalizeSlotName(cells[0])
        if (!name || name === '插槽') continue
        slots.set(name, { name, desc: cells[1] || '', usage: '', version: '' })
      }
    } else if (first.includes('方法')) {
      for (const cells of rows) {
        const name = (cells[0] || '').trim()
        if (!name || name === '方法') continue
        methods.set(name, { name, usage: cells[1] || '', desc: cells[2] || '', detail: cells[3] || '' })
      }
    } else if (header.includes('名称') && head.includes('可用组件')) {
      for (const cells of rows) {
        const name = normalizeSlotName(cells[0])
        if (!name || name === '名称') continue
        slots.set(name, { name, desc: cells[1] || '', usage: cells[2] || '', version: cells[3] || '' })
      }
    } else if (header.includes('名称') && head.includes('用法')) {
      const target = rows.some((cells) => /[.(]/.test(cells[1] || '')) ? methods : events
      for (const cells of rows) {
        const name = cells[0] || ''
        if (!name || name === '名称') continue
        target.set(name, {
          name,
          usage: cells[1] || '',
          desc: cells[2] || '',
          detail: cells[3] || '',
          version: cells[4] || '',
        })
      }
    } else if (header.includes('类名') || header.includes('样式类') || header.includes('外部样式')) {
      for (const cells of rows) {
        const name = cleanCell(cells[0] || '').replace(/[`*]/g, '')
        if (!name) continue
        extraClasses.set(name, cleanCell(cells[1] || ''))
      }
    }
  }

  // 「引入」代码段里给出的标签名
  const importTags = new Map()
  const introIdx = src.search(/^##\s*引入/im)
  if (introIdx !== -1) {
    const seg = src.slice(introIdx, introIdx + 1200)
    for (const m of seg.matchAll(/["']([\w-]+)["']\s*:\s*["'](coolui-scroller\/[\w/-]+)["']/g)) {
      importTags.set(m[2].replace(/^coolui-scroller\//, ''), m[1])
    }
  }

  return { title, props, events, methods, slots, extraClasses, importTags }
}

/* ------------------------------------------------------------------ *
 * demo 里的真实标签名统计
 * ------------------------------------------------------------------ */

function collectDemoTags() {
  const stat = new Map() // importPath(no pkg prefix) -> Map<tag, count>
  for (const file of walk(DEMO_DIR, ['.json'])) {
    let json
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      continue
    }
    const using = json?.usingComponents
    if (!using) continue
    for (const [tag, ref] of Object.entries(using)) {
      if (typeof ref !== 'string' || !ref.startsWith(PACKAGE_NAME + '/')) continue
      const p = ref.slice(PACKAGE_NAME.length + 1)
      const map = stat.get(p) || new Map()
      map.set(tag, (map.get(tag) || 0) + 1)
      stat.set(p, map)
    }
  }
  return stat
}

/** 组件在 npm 包里的引入路径：
 *  一级目录组件 -> coolui-scroller/scroller/index
 *  多级目录组件 -> coolui-scroller/sort/index（其下才是 index.js）
 */
function buildImportPath(relDir) {
  return relDir.includes('/') ? `${PACKAGE_NAME}/${relDir}` : `${PACKAGE_NAME}/${relDir}/index`
}

function buildImportPathVariants(relDir) {
  const set = new Set()
  if (relDir.includes('/')) set.add(`${PACKAGE_NAME}/${relDir}`)
  set.add(`${PACKAGE_NAME}/${relDir}/index`)
  set.add(`${PACKAGE_NAME}/${relDir}`)
  return [...set]
}

/* ------------------------------------------------------------------ *
 * 主流程
 * ------------------------------------------------------------------ */

function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function main() {
  const docs = new Map()
  for (const file of fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'))) {
    docs.set(path.basename(file, '.md'), parseDoc(path.join(DOCS_DIR, file)))
  }

  const demoTags = collectDemoTags()

  const components = []
  const jsFiles = walk(COMPONENTS_DIR, ['.js']).filter((f) => path.basename(f) === 'index.js')

  for (const file of jsFiles) {
    const relDir = path.relative(COMPONENTS_DIR, path.dirname(file)).replace(/\\/g, '/')
    if (!relDir || relDir === '.') continue // 根 index.js 是工具库，不是组件

    const sourceData = parseComponentJs(file)
    const importPath = buildImportPath(relDir)
    const docName = MD_OF_COMPONENT[relDir]
    const doc = docName ? docs.get(docName) : undefined

    // 标签名：优先 demo 里的真实用法，其次文档「引入」，最后按目录名推导
    const tagStat = new Map()
    for (const variant of buildImportPathVariants(relDir)) {
      for (const [tagName, count] of demoTags.get(variant.slice(PACKAGE_NAME.length + 1)) || []) {
        tagStat.set(tagName, (tagStat.get(tagName) || 0) + count)
      }
    }
    const parts = relDir.split('/')
    const fallback = parts.length > 1 ? `${kebab(parts[parts.length - 2])}-${kebab(parts[parts.length - 1])}` : parts[0]
    const aliases = new Set(tagStat.keys())
    const fromDoc = doc?.importTags.get(relDir) || doc?.importTags.get(`${relDir}/index`)
    if (fromDoc) aliases.add(fromDoc)
    aliases.add(fallback)
    if (parts.length === 1) aliases.add(kebab(parts[0]))
    const sorted = [...aliases].sort((a, b) => (tagStat.get(b) || 0) - (tagStat.get(a) || 0))
    const tag = sorted[0] || fallback

    // 属性：以源码为准，文档补充说明；文档中独有的一并保留（组件可能通过 relations 动态接收）
    const props = []
    const seen = new Set()
    for (const p of sourceData.props) {
      const docProp = doc?.props.get(p.name)
      props.push({
        ...p,
        desc: docProp?.desc || '',
        version: docProp?.version || '',
        deprecated: !!docProp?.deprecated,
        enum: docProp?.enum,
        fromDoc: false,
      })
      seen.add(p.name)
    }
    if (doc) {
      for (const dp of doc.props.values()) {
        if (seen.has(dp.name)) continue
        props.push({
          name: dp.name,
          type: dp.type ? dp.type.toLowerCase() : 'any',
          default: dp.default,
          desc: dp.desc,
          version: dp.version,
          deprecated: dp.deprecated,
          enum: dp.enum,
          fromDoc: true,
        })
      }
    }

    // 事件：源码 triggerEvent + 文档事件表
    const events = []
    const seenEvents = new Set()
    for (const e of sourceData.events) {
      const d = doc?.events.get(e.name)
      events.push({
        name: e.name,
        desc: d?.desc || '',
        usage: d?.usage || '',
        detail: d?.detail || '',
        version: d?.version || '',
      })
      seenEvents.add(e.name)
    }
    if (doc) {
      for (const de of doc.events.values()) {
        if (seenEvents.has(de.name)) continue
        events.push({ name: de.name, desc: de.desc, usage: de.usage, detail: de.detail, version: de.version })
      }
    }

    const methodDoc = []
    for (const m of sourceData.methods) {
      const d = doc?.methods.get(m.name)
      methodDoc.push({ name: m.name, usage: d?.usage || '', desc: d?.desc || '', detail: d?.detail || '' })
    }

    // 插槽：以 wxml 为准，文档补充说明
    const wxmlFile = path.join(path.dirname(file), 'index.wxml')
    const slots = fs.existsSync(wxmlFile) ? parseSlots(wxmlFile) : []
    for (const s of slots) {
      const d = doc?.slots.get(s.name)
      s.desc = d?.desc || ''
      s.usage = d?.usage || ''
    }
    if (doc) {
      for (const ds of doc.slots.values()) {
        if (!slots.some((s) => s.name === ds.name)) slots.push({ name: ds.name, desc: ds.desc, usage: ds.usage })
      }
    }

    const externalClasses = [...sourceData.externalClasses]
    for (const name of doc?.extraClasses.keys() || []) {
      if (!externalClasses.includes(name)) externalClasses.push(name)
    }

    components.push({
      platform: 'native',
      key: relDir,
      tag,
      aliases: sorted.filter((a) => a !== tag),
      importPath,
      title: doc?.title || `${relDir} 组件`,
      desc: readIntro(relDir, docName),
      doc: docName || '',
      props,
      events,
      methods: methodDoc,
      slots,
      externalClasses,
      relations: sourceData.relations,
    })
  }

  const uniappComponents = extractUniappComponents()
  components.push(...uniappComponents)
  components.sort((a, b) => (a.tag > b.tag ? 1 : -1))

  const data = {
    version: JSON.parse(fs.readFileSync(path.join(COMPONENTS_DIR, 'package.json'), 'utf8')).version,
    packageName: PACKAGE_NAME,
    uniappPackageName: UNIAPP_PACKAGE_NAME,
    generatedAt: new Date().toISOString(),
    components,
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log(`已生成 ${components.length} 个组件的元数据 -> ${path.relative(ROOT, OUTPUT)}`)
  for (const c of components) {
    console.log(`  - ${c.tag.padEnd(22)} props:${String(c.props.length).padStart(2)} events:${String(c.events.length).padStart(2)} slots:${String(c.slots.length).padStart(2)}  ${c.importPath}`)
  }
}

function readIntro(relDir, docName) {
  // 取 md 中「介绍/简介」下的第一段文字作为组件描述
  if (!docName) return ''
  const mdPath = path.join(DOCS_DIR, `${docName}.md`)
  if (!fs.existsSync(mdPath)) return ''
  const src = fs.readFileSync(mdPath, 'utf8')
  const m = src.match(/^##\s*(介绍|简介)\s*$([\s\S]*?)(?=\n##|\n```)/m)
  if (!m) return ''
  const lines = m[2].split(/\r?\n/)
  const picked = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    // 遇到示例 HTML（doc 里常用 <div> 做示例图）就停止
    if (line.startsWith('<') || line.startsWith('<!--') || line.includes('="') || line.startsWith(':')) break
    picked.push(line)
  }
  return picked.join(' ').slice(0, 200)
}

/* ------------------------------------------------------------------ *
 * uni-app（Vue SFC）解析
 * ------------------------------------------------------------------ */

/** 拆分 .vue 的 <template> 与 <script> */
function splitVueSfc(src) {
  const templateMatch = src.match(/<template[^>]*>([\s\S]*)<\/template>/)
  const scriptMatch = src.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  return {
    template: templateMatch ? templateMatch[1] : '',
    script: scriptMatch ? scriptMatch[1] : '',
  }
}

/** 取 defineProps / defineEmits 等调用的实参文本（自动跳过泛型 <...>） */
function callArgAfter(src, name) {
  const idx = src.indexOf(name)
  if (idx === -1) return null
  let i = idx + name.length
  const skipWs = () => {
    while (i < src.length && /\s/.test(src[i])) i++
  }
  skipWs()
  if (src[i] === '<') {
    let depth = 0
    while (i < src.length) {
      const ch = src[i]
      if (ch === '=' && src[i + 1] === '>') {
        i += 2
        continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        const q = ch
        i++
        while (i < src.length && src[i] !== q) {
          if (src[i] === '\\') i++
          i++
        }
        i++
        continue
      }
      if (ch === '<') depth++
      else if (ch === '>') {
        depth--
        if (depth === 0) {
          i++
          break
        }
      }
      i++
    }
    skipWs()
  }
  if (src[i] !== '(') return null
  const balanced = readBalanced(src, i)
  return balanced ? balanced.inner : null
}

/** 取 defineEmits<{...}> / defineProps<Interface> 的泛型内容 */
function typeArgAfter(src, name) {
  const idx = src.indexOf(name)
  if (idx === -1) return null
  let i = idx + name.length
  while (i < src.length && /\s/.test(src[i])) i++
  if (src[i] !== '<') return null
  const start = i + 1
  let depth = 1
  i++
  while (i < src.length) {
    const ch = src[i]
    if (ch === '=' && src[i + 1] === '>') {
      i += 2
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch
      i++
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (ch === '<') depth++
    else if (ch === '>') {
      depth--
      if (depth === 0) return src.slice(start, i)
    }
    i++
  }
  return null
}

/** 解析 uni-app 的属性类型：String / Boolean / String as PropType<'a' | 'b'> */
function parseUniappPropType(raw) {
  const text = minify(raw)
  const asMatch = /^(\w+)\s+as\s+PropType<([\s\S]+)>$/.exec(text)
  const base = asMatch ? asMatch[1] : text
  const generic = asMatch ? asMatch[2] : ''
  const type = TYPE_MAP[base] || (/^[A-Z]/.test(base) ? base.toLowerCase() : base) || 'any'
  const values = [...generic.matchAll(/'([^']+)'|"([^"]+)"/g)].map((m) => m[1] ?? m[2])
  const enums = values.filter((v) => v && !/^(string|number|boolean)$/.test(v))
  return { type: type || 'any', enum: enums.length ? enums : undefined }
}

function parseUniappProps(script) {
  const inner = callArgAfter(script, 'defineProps')
  if (!inner) return []
  const objStart = inner.indexOf('{')
  if (objStart === -1) return []
  const obj = readBalanced(inner, objStart)
  if (!obj) return []
  const props = []
  for (const member of parseMembers(obj.inner)) {
    const detail =
      member.block === '{' ? Object.fromEntries(parseMembers(member.raw).map((p) => [p.key, p.raw])) : {}
    if (!detail.type) continue
    const parsed = parseUniappPropType(detail.type)
    props.push({
      name: member.key,
      type: parsed.type,
      default: normalizeDefault(detail.default),
      enum: parsed.enum,
    })
  }
  return props
}

function parseUniappEmits(script) {
  const typeContent = typeArgAfter(script, 'defineEmits')
  if (typeContent) {
    const events = []
    const re = /(?:\/\*\*([\s\S]*?)\*\/\s*)?\(\s*e\s*:\s*['"]([\w:.-]+)['"]((?:\s*,[^)]*)?)\)\s*:/g
    let m
    while ((m = re.exec(typeContent))) {
      const desc = m[1] ? m[1].replace(/^\s*\*\s?/gm, '').trim() : ''
      const name = m[2]
      const detail = (m[3] || '').replace(/^\s*,\s*/, '').trim()
      if (!events.some((e) => e.name === name)) events.push({ name, desc, detail })
    }
    return events
  }
  // 兜底：defineEmits(['refresh', 'loadmore'])
  const arg = callArgAfter(script, 'defineEmits')
  if (!arg) return []
  return [...arg.matchAll(/['"]([\w:.-]+)['"]/g)].map((m) => ({ name: m[1], desc: '', detail: '' }))
}

/** 解析 types.d.ts 里所有 interface 的成员（注释 / 类型 / 枚举） */
function parseTsInterfaces(src) {
  const map = new Map()
  const re = /export\s+interface\s+(\w+)\s*\{/g
  let m
  while ((m = re.exec(src))) {
    const openIdx = src.indexOf('{', m.index)
    const balanced = readBalanced(src, openIdx)
    if (!balanced) continue
    map.set(m[1], parseTsInterfaceBody(balanced.inner))
    re.lastIndex = balanced.end + 1
  }
  return map
}

function parseTsInterfaceBody(inner) {
  const props = new Map()
  const lines = inner.split(/\r?\n/)
  let doc = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (line.startsWith('/**')) {
      let buf = line
      while (!buf.includes('*/') && i + 1 < lines.length) buf += ' ' + lines[++i].trim()
      doc = buf
        .replace(/^\/\*\*/, '')
        .replace(/\*\/$/, '')
        .replace(/^\s*\*\s?/gm, '')
        .trim()
      continue
    }
    const pm = /^([A-Za-z_$][\w$]*)\??\s*:\s*(.+?)[,;]?$/.exec(line)
    if (pm) {
      const rawType = pm[2].replace(/[,;]\s*$/, '').trim()
      props.set(pm[1], { desc: doc || '', type: rawType, enum: extractEnumFromTsType(rawType) })
      doc = null
    }
  }
  return props
}

function extractEnumFromTsType(type) {
  const values = [...type.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]).filter(Boolean)
  const filtered = values.filter((v) => !/^(string|number|boolean|any)$/.test(v))
  return filtered.length ? filtered : undefined
}

/** 目录名转 PascalCase：coolui-scroller-back-to-top -> CooluiScrollerBackToTop */
function pascal(name) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

/** uni-app 组件属性接口名：coolui-scroller-refresh -> CooluiScrollerRefreshProps */
function uniappPropsInterfaceName(dir) {
  return `${pascal(dir)}Props`
}

/** TS 类型转插件使用的简单类型，优先沿用 defineProps 推断结果 */
function pickUniappType(primary, tsType) {
  if (primary && primary !== 'any') return primary
  if (!tsType) return 'any'
  const t = tsType.trim()
  if (t === 'boolean') return 'boolean'
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (/\[\]$/.test(t) || /^Array</.test(t)) return 'array'
  if (/^\{/.test(t) || /^Coolui/.test(t)) return 'object'
  if (t.includes("'") || t.includes('"')) return 'string'
  return 'any'
}

const UNIAPP_DOC_OF_COMPONENT = {
  'coolui-scroller': 'scroller',
  'coolui-scroller-refresh': 'refresh',
  'coolui-scroller-parallax': 'parallax',
  'coolui-scroller-empty': 'empty',
  'coolui-scroller-item': 'item',
  'coolui-scroller-loadmore': 'loadmore',
  'coolui-scroller-handtip': 'handtip',
  'coolui-scroller-nav': 'nav',
  'coolui-scroller-nav-pannel': 'navPannel',
  'coolui-scroller-nav-bar': 'navBar',
  'coolui-scroller-search': 'search',
  'coolui-scroller-page': 'page',
  'coolui-scroller-second-floor': 'floor',
  'coolui-scroller-second-floor-refresh': 'floor',
  'coolui-scroller-back-to-top': 'backToTop',
  'coolui-scroller-sort': 'sort',
  'coolui-scroller-sort-item': 'sort',
  'coolui-scroller-longlist': 'longlist',
}

function uniappDocName(dir, docNames) {
  if (UNIAPP_DOC_OF_COMPONENT[dir]) return UNIAPP_DOC_OF_COMPONENT[dir]
  const suffix = dir.replace(/^coolui-scroller-?/, '')
  const camel = pascal(suffix)
  const candidates = [suffix, camel ? camel.charAt(0).toLowerCase() + camel.slice(1) : '']
  return candidates.find((c) => c && docNames.has(c))
}

/** 取 uni-app 文档 title 下方第一段文字作为组件描述 */
function readUniappIntro(docName) {
  if (!docName) return ''
  const mdPath = path.join(UNIAPP_DOCS_DIR, `${docName}.md`)
  if (!fs.existsSync(mdPath)) return ''
  const body = fs.readFileSync(mdPath, 'utf8').replace(/^#\s+.+$/m, '')
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    if (
      line.startsWith('#') ||
      line.startsWith('>') ||
      line.startsWith('|') ||
      line.startsWith('```') ||
      line.startsWith('<!--')
    ) {
      break
    }
    return line.replace(/`/g, '').slice(0, 200)
  }
  return ''
}

function extractUniappComponents() {
  if (!fs.existsSync(UNIAPP_DIR)) return []

  const docs = new Map()
  if (fs.existsSync(UNIAPP_DOCS_DIR)) {
    for (const file of fs.readdirSync(UNIAPP_DOCS_DIR).filter((f) => f.endsWith('.md'))) {
      docs.set(path.basename(file, '.md'), parseDoc(path.join(UNIAPP_DOCS_DIR, file)))
    }
  }
  const interfaces = fs.existsSync(UNIAPP_TYPES_FILE)
    ? parseTsInterfaces(fs.readFileSync(UNIAPP_TYPES_FILE, 'utf8'))
    : new Map()

  const components = []
  for (const entry of fs.readdirSync(UNIAPP_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const dir = entry.name
    const vueFile = path.join(UNIAPP_DIR, dir, `${dir}.vue`)
    if (!fs.existsSync(vueFile)) continue

    const { script } = splitVueSfc(fs.readFileSync(vueFile, 'utf8'))
    const docName = uniappDocName(dir, docs)
    const doc = docName ? docs.get(docName) : undefined
    const iface = interfaces.get(uniappPropsInterfaceName(dir))

    // props：defineProps 提供类型/默认值/枚举，types.d.ts 与文档补充说明
    const props = []
    const seen = new Set()
    for (const p of parseUniappProps(script)) {
      const ts = iface?.get(p.name)
      const dp = doc?.props.get(p.name)
      props.push({
        name: p.name,
        type: pickUniappType(p.type, ts?.type),
        default: p.default,
        desc: ts?.desc || dp?.desc || '',
        version: dp?.version || '',
        deprecated: !!dp?.deprecated,
        enum: p.enum || ts?.enum || dp?.enum,
        fromDoc: false,
      })
      seen.add(p.name)
    }
    if (iface) {
      for (const [name, ts] of iface) {
        if (seen.has(name)) continue
        const dp = doc?.props.get(name)
        props.push({
          name,
          type: pickUniappType('', ts.type),
          default: undefined,
          desc: ts.desc || dp?.desc || '',
          version: dp?.version || '',
          deprecated: !!dp?.deprecated,
          enum: ts.enum || dp?.enum,
          fromDoc: false,
        })
        seen.add(name)
      }
    }
    // 文档只用于补充已有属性的说明，不追加文档专有项（避免 sort / sort-item 共享文档互相污染）

    // events：defineEmits 为准，文档补充
    const events = []
    const seenEvents = new Set()
    for (const e of parseUniappEmits(script)) {
      const de = doc?.events.get(e.name)
      events.push({
        name: e.name,
        desc: e.desc || de?.desc || '',
        usage: '',
        detail: e.detail || de?.detail || '',
        version: '',
      })
      seenEvents.add(e.name)
    }
    // 文档只用于补充已有事件的说明，不追加文档专有项

    // slots：模板里的 <slot name> 为准，文档补充
    const slots = parseSlots(vueFile)
    for (const s of slots) {
      const ds = doc?.slots.get(s.name)
      s.desc = ds?.desc || ''
      s.usage = ds?.usage || ''
    }
    // 文档只用于补充已有插槽的说明，不追加文档专有项

    components.push({
      platform: 'uniapp',
      key: dir,
      tag: dir,
      aliases: [],
      importPath: `${UNIAPP_PACKAGE_NAME}/components/${dir}/${dir}.vue`,
      title: doc?.title || `${dir} 组件`,
      desc: readUniappIntro(docName),
      doc: docName || '',
      props,
      events,
      methods: [],
      slots,
      externalClasses: [],
      relations: [],
    })
  }
  return components
}

main()
