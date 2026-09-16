/**
 * coolui-scroller uni-app 版 · 长列表分页工具 类型声明
 * 实现见同目录 `longlist.js`。
 */

/** 使用 setHeight 时，页面实例上需要维护的字段 */
export interface CooluiLonglistPage {
  /** 分页参数，读取 param.page 作为当前页下标 */
  param: { page: number; [key: string]: unknown }
  /** 正在渲染的分页数组 */
  list: unknown[]
  /** 每一页的完整数据 */
  wholeList: unknown[][]
  /** 每一页渲染后的高度缓存 */
  pageHeightArr: number[]
  /** Vue2 风格的 $set（可选） */
  $set?: (target: unknown, key: number, value: unknown) => void
  /** 小程序组件实例（可选，透传给 createIntersectionObserver） */
  $scope?: object
}

/** 记录当前页高度并按页缓存渲染（配合 coolui-scroller-page 使用） */
export function setHeight(that: CooluiLonglistPage): void

/** 长列表窗口计算结果 */
export interface CooluiLonglistWindow {
  /** 需要真实渲染的起始页下标 */
  start: number
  /** 需要真实渲染的结束页下标（count 为 0 时返回 -1） */
  end: number
  /** 窗口上方占位块高度 */
  topHeight: number
  /** 窗口下方占位块高度 */
  bottomHeight: number
}

/**
 * 计算长列表渲染窗口（纯函数）
 * 只渲染窗口内的页，窗口外折叠成上下两个占位块，使节点数与总页数无关
 */
export function computeLonglistWindow(options: {
  heights?: number[]
  count?: number
  scrollTop?: number
  viewportHeight?: number
  overscan?: number
  estimate?: number
}): CooluiLonglistWindow

declare const _default: {
  setHeight: typeof setHeight
}
export default _default
