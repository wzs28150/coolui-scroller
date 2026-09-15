/**
 * demo 公共类型
 *
 * 组件自身的 props / 事件类型直接复用库导出（`coolui-scroller-uni/types`），
 * 这里只补充 demo 自己的 mock 数据、页面局部模型与模板事件负载类型。
 */
import type {
  CooluiLoadmoreState,
  CooluiRefreshConfig,
} from 'coolui-scroller-uni/types'

/** 触摸点 */
export interface DemoTouchPoint {
  clientX: number
  clientY: number
}

/**
 * 触摸事件（touchstart / touchmove / touchend）
 * 用 ArrayLike 描述 touches / changedTouches：既能表达小程序的触摸事件对象，
 * 又与浏览器 TouchEvent 兼容，标注到模板事件上时不会与 DOM 事件类型冲突。
 */
export interface DemoTouchEvent {
  touches: ArrayLike<DemoTouchPoint>
  changedTouches: ArrayLike<DemoTouchPoint>
}

/** 带 data-* 的点击事件（通过 currentTarget.dataset 取 data-xxx） */
export interface DemoTapEvent {
  currentTarget: {
    dataset: Record<string, string>
  }
}

/** switch / radio 等组件的 change 事件 */
export interface DemoChangeEvent<T = string> {
  detail: {
    value: T
  }
}

/** coolui-scroller-nav 的 change 事件负载 */
export interface DemoNavChangeEvent {
  id?: string | number
  index: number
}

/** coolui-scroller-search 的 btnClick / confirm 事件负载 */
export interface DemoSearchPayload {
  key: string
}

/** 分页参数 */
export interface DemoPageParam {
  limit: number
  page: number
  [key: string]: number
}

/** mock 分页接口响应 */
export type DemoListResponse<T> = {
  code: number
  data: {
    /** 总页数 */
    last: number
    /** 当前页数据 */
    list: T[]
  }
}

/**
 * mock 列表项（普通图文列表）
 * 这里用 type 而非 interface：对象字面量类型带隐式索引签名，
 * 可直接传给库中带 `[key: string]: unknown` 的类型（如 CooluiPageListItem[]）。
 */
export type DemoArticle = {
  id?: number
  img?: string
  title?: string
}

/** mock 列表项（图文社交） */
export type DemoSocialItem = {
  user: {
    name: string
    photo: string
  }
  addTime?: string
  type?: 'imgs' | 'video' | (string & {})
  img?: string[]
  video?: {
    url: string
    width: number
    height: number
  }
  /** 正文 */
  content?: string
  likeNum?: number
  collectNum?: number
  chatNum?: number
}

/* ------------------------------ 首页数据 ------------------------------ */

/** 首页：组件入口 */
export interface DemoComponentEntry {
  title: string
  path: string
}

/** 首页：案例入口 */
export interface DemoCaseEntry {
  id: number
  title: string
  img: string
  page: string
}

/* --------------------------- 各页面局部模型 --------------------------- */

/**
 * 下拉刷新配置
 * 在库的 CooluiRefreshConfig 基础上，兼容 demo 里的历史写法（type / isBackBtn：
 * 组件内部只读 shake / height / style / text / background / isAutoTriggered）
 */
export interface DemoRefreshConfig extends CooluiRefreshConfig {
  type?: string
  isBackBtn?: boolean
}

/** 加载更多配置集合（对应 loadmore 组件的 status / loading / more / noMore） */
export interface DemoLoadmoreSetting {
  status: 'more' | 'loading' | 'noMore' | (string & {})
  more: CooluiLoadmoreState
  loading: CooluiLoadmoreState
  noMore: CooluiLoadmoreState
  color?: string
}

/** 空列表配置（对应 empty 组件的 emptyImg / emptyText） */
export interface DemoEmptySetting {
  img: string
  text: string
}

/** nav 组件的文字 / 背景配色配置 */
export interface DemoNavColorConfig {
  color: string
  activeColor: string
}

/** 下拉刷新状态：pulldown 未达阈值 / loosen 松开可刷新 / loading 加载中 */
export type DemoRefreshState = 'pulldown' | 'loosen' | 'loading' | (string & {})

/** 下拉二楼 demo：频道列表项 */
export interface DemoChannelItem {
  icon: string
  name: string
}

/** 下拉二楼 demo：位置类型 */
export type DemoSecondFloorType = 'top' | 'center' | 'bottom'
