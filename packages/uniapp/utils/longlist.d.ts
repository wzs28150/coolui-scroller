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

declare const _default: {
  setHeight: typeof setHeight
}
export default _default
