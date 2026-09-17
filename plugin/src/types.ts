/** 组件元数据的数据结构（由 scripts/extract-metadata.mjs 生成） */

export interface PropMeta {
  name: string
  type: string
  default?: string
  desc: string
  version: string
  deprecated: boolean
  /** true 表示只出现在文档中，源码里没有直接声明 */
  fromDoc: boolean
  /** 文档里用反引号标出的可选值 */
  enum?: string[]
}

export interface EventMeta {
  name: string
  desc: string
  usage: string
  detail: string
  version: string
}

export interface SlotMeta {
  name: string
  desc: string
  usage: string
}

export interface MethodMeta {
  name: string
  usage: string
  desc: string
  detail: string
}

/** 组件所属平台：微信原生小程序 / uni-app（Vue SFC） */
export type Platform = 'native' | 'uniapp'

export interface ComponentMeta {
  /** 所属平台 */
  platform: Platform
  /** 组件在包内的目录名，如 scroller / sort/item / coolui-scroller-refresh */
  key: string
  /** 推荐标签名 */
  tag: string
  /** 其它常见标签名 */
  aliases: string[]
  /** npm 引入路径，如 coolui-scroller/scroller/index */
  importPath: string
  title: string
  desc: string
  /** 文档文件名（不含扩展名） */
  doc: string
  props: PropMeta[]
  events: EventMeta[]
  methods: MethodMeta[]
  slots: SlotMeta[]
  externalClasses: string[]
  relations: string[]
}

export interface MetaData {
  version: string
  packageName: string
  uniappPackageName: string
  generatedAt: string
  components: ComponentMeta[]
}
