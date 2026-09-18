/**
 * coolui-scroller uni-app 版 · 平台 API 适配层 类型声明
 *
 * 实现见同目录 `platform.js`（保持 JS 实现，便于直接发布源码给小程序构建），
 * 这里只描述对外签名，供 TypeScript / 编辑器使用。
 */
import type {
  CooluiMenuButtonRect,
  CooluiSelectorQuery,
  CooluiWindowInfo,
} from '../types'

/** 获取节点查询对象（组件内使用时传入组件实例） */
export function getSelectorQuery(component?: unknown): CooluiSelectorQuery

/** 获取窗口信息（windowHeight / statusBarHeight 等） */
export function getWindowInfo(): CooluiWindowInfo

/** 获取胶囊按钮位置（仅微信小程序等部分平台支持） */
export function getMenuButtonBoundingClientRect(): CooluiMenuButtonRect | null

/** 短震动 */
export function vibrateShort(): void

/** 顶部导航栏加载动画 */
export function showNavigationBarLoading(): void

/** 隐藏顶部导航栏加载动画 */
export function hideNavigationBarLoading(): void

/** 写入本地缓存 */
export function setStorageSync(key: string, value: string): void

/** 读取本地缓存 */
export function getStorageSync(key: string): string

/** 返回上一页 */
export function navigateBack(delta?: number): void

/** 创建交叉观察者（长列表分页用） */
export function createIntersectionObserver(
  component?: unknown,
  options?: Record<string, unknown>
): any

/** 对象深度合并（后者覆盖前者） */
export function deepMerge<T extends object, S extends object>(
  target: T,
  source?: S | null
): T & S

/** 防抖执行器（timeout 保存在传入的组件实例上） */
export function createDebouncer(
  component: object | null | undefined
): (fn: () => void, wait: number) => void
