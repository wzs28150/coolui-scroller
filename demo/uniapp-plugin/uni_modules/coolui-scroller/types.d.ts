/**
 * coolui-scroller uni-app 版 · 公共类型定义
 *
 * 用途：
 * 1. 组件内部 props / emits / provide / inject 的类型来源（各组件通过
 *    `import type { XxxProps } from '../../types'` 引入，类型导入在构建时会被抹除，不产生运行时代码）；
 * 2. 使用方可直接 `import type { CooluiScrollerProps } from 'coolui-scroller-uni/types'` 复用。
 *
 * 注意：本文件只包含类型声明，不要在这里写运行时代码。
 */

/* ------------------------------------------------------------------ *
 * 通用配置
 * ------------------------------------------------------------------ */

/** 矩形信息（节点查询返回） */
export interface CooluiRect {
  id?: string
  dataset?: Record<string, unknown>
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

/** 节点查询对象（对 uni.createSelectorQuery 的最小描述） */
export interface CooluiSelectorQuery {
  in(component: unknown): CooluiSelectorQuery
  select(selector: string): CooluiSelectorQuery
  selectAll(selector: string): CooluiSelectorQuery
  boundingClientRect(callback?: (res: CooluiRect[]) => void): CooluiSelectorQuery
  exec(callback?: (res: CooluiRect[]) => void): void
}

/** 窗口信息（不同平台字段可能缺失，故均可选） */
export interface CooluiWindowInfo {
  windowHeight?: number
  windowWidth?: number
  statusBarHeight?: number
  [key: string]: unknown
}

/** 胶囊按钮信息 */
export interface CooluiMenuButtonRect {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

/** 普通背景配置 */
export interface CooluiBackgroundConfig {
  /** 背景颜色 */
  color?: string
  /** 背景图地址 */
  img?: string
}

/** 下拉刷新背景配置（比普通背景多一个 height） */
export interface CooluiRefreshBackgroundConfig extends CooluiBackgroundConfig {
  /**
   * 背景高度(px)。大于 refresh 自身高度时，松手后会先回落到 refresh 高度显示加载中，
   * 刷新完成再整体回弹（与原生“基础效果”一致）
   */
  height?: number
}

/** 文本配置 */
export interface CooluiTextConfig {
  /** 文字颜色 */
  color?: string
  /** 文字阴影范围，0 为不开启，数值越大范围越大 */
  shadow?: number
}

/** 下拉刷新文本配置（logoText 效果使用） */
export interface CooluiRefreshTextConfig extends CooluiTextConfig {
  /** 文本内容 */
  content?: string
  /** 字号，单位 rpx */
  size?: number | string
  /** 文本背景图（用于文字渐变/发光动画） */
  img?: string
  /** 字体 */
  font?: string
}

/** 下拉刷新配置 */
export interface CooluiRefreshConfig {
  /** 下拉震动 */
  shake?: boolean
  /** refresh 区域高度(px) */
  height?: number
  /** 是否自动触发刷新并回弹；false 时需手动调用 settriggered(false) */
  isAutoTriggered?: boolean
  /** 内置三点颜色风格 */
  style?: 'black' | 'white' | (string & {})
  /** 文本配置 */
  text?: CooluiRefreshTextConfig
  /** 背景配置 */
  background?: CooluiRefreshBackgroundConfig
}

/** 加载更多中的单个状态配置 */
export interface CooluiLoadmoreState {
  /** 文案 */
  text?: string
  /** 颜色 */
  color?: string
}

/** 导航栏配置 */
export interface CooluiNavBarConfig {
  /** 返回按钮 */
  back?: {
    /** 是否显示返回按钮 */
    show?: boolean
    /** 自定义返回逻辑，不传则 navigateBack(1) */
    click?: () => void
  }
  /** 背景 */
  background?: CooluiBackgroundConfig
  /** 文本 */
  text?: CooluiTextConfig
}

/** 下拉二楼刷新文案配置 */
export interface CooluiSecondFloorRefreshConfig {
  /** 正在加载 */
  loadingText?: string
  /** 二楼展开后的返回按钮文案 */
  backText?: string
  /** 开始下拉 */
  downText?: string
  /** 松开刷新提示 */
  tipText?: string
  /** 继续下拉提示 */
  moreText?: string
  /** 文字颜色 */
  color?: string
}

/* ------------------------------------------------------------------ *
 * 各组件 Props
 * ------------------------------------------------------------------ */

/** coolui-scroller 属性 */
export interface CooluiScrollerProps {
  /** 是否为空数据（配合 empty 插槽） */
  isEmpty?: boolean
  /** 背景色（仅保留 API 兼容，组件内部不使用） */
  background?: string
  /** 是否显示回到顶部按钮（实际由 backToTop 组件注册决定） */
  isBackBtn?: boolean
  /** 是否开启 scroll-view 的 flex 模式 */
  enableFlex?: boolean
  /** 滚动到指定 id 的位置 */
  toView?: string
  /** 滚动到指定位置(scroll-top) */
  top?: number
  /** 设置滚动位置时使用动画过渡 */
  animation?: boolean
}

/** coolui-scroller-refresh 属性 */
export interface CooluiScrollerRefreshProps {
  /** 刷新效果类型：default(内置三点) / base(基础箭头) / logoText(文字) / diy(完全自定义) */
  type?: 'default' | 'base' | 'logoText' | 'diy' | (string & {})
  /** 当前下拉进度 0~1（可用 v-model:threshold 双向绑定） */
  threshold?: number
  /** 是否加载中 */
  isloading?: boolean
  /** 刷新状态（可用 v-model:refreshstate 双向绑定） */
  refreshstate?: 'pulldown' | 'loosen' | 'loading' | (string & {})
  /** 刷新配置 */
  config?: CooluiRefreshConfig
}

/** coolui-scroller-loadmore 属性 */
export interface CooluiScrollerLoadmoreProps {
  /** 状态：more / loading / noMore */
  status?: 'more' | 'loading' | 'noMore' | (string & {})
  /** loading 状态配置 */
  loading?: CooluiLoadmoreState
  /** more 状态配置 */
  more?: CooluiLoadmoreState
  /** noMore 状态配置 */
  noMore?: CooluiLoadmoreState
  /** 兼容字段 */
  color?: string
  /** 兼容字段 */
  shake?: boolean
}

/** coolui-scroller-back-to-top 属性 */
export interface CooluiScrollerBackToTopProps {
  /** 显示后自动隐藏的延时(ms)，0 表示不自动隐藏 */
  delay?: number
  /** 滚动超过该距离(px)后显示 */
  threshold?: number
}

/** coolui-scroller-empty 属性 */
export interface CooluiScrollerEmptyProps {
  /** 空列表图片 */
  emptyImg?: string
  /** 空列表文字 */
  emptyText?: string
}

/** coolui-scroller-item 属性 */
export interface CooluiScrollerItemProps {
  /** 是否开启点击水波纹 */
  ripple?: boolean
}

/** 长列表分页中的一项（占位时仅需 height） */
export interface CooluiPageListItem {
  /** 占位高度(px) */
  height?: number
  [key: string]: unknown
}

/** coolui-scroller-page 属性 */
export interface CooluiScrollerPageProps {
  /** 分页数据：length === 1 且 [0].height 时渲染为占位块 */
  pageList?: CooluiPageListItem[]
}

/** coolui-scroller-parallax 属性 */
export interface CooluiScrollerParallaxProps {
  /** 视差系数（位移比例） */
  parallax?: number
  /** 位移方向 */
  direction?: 'to top' | 'to bottom' | 'to left' | 'to right' | (string & {})
}

/** 分类导航单项 */
export interface CooluiScrollerNavItem {
  id?: string | number
  title?: string
  [key: string]: unknown
}

/** coolui-scroller-nav 属性 */
export interface CooluiScrollerNavProps {
  /** 导航数据 */
  list?: CooluiScrollerNavItem[]
  /** 是否显示底部边框 */
  border?: boolean
  /** 文字颜色配置 */
  text?: {
    color?: string
    activeColor?: string
  }
  /** 背景/下划线颜色配置 */
  background?: {
    color?: string
    activeColor?: string
  }
  /** 每屏显示个数，'auto' 表示按内容自适应 */
  navPerView?: number | string
  /** 项之间的间距(px) */
  spaceBetween?: number
  /** 选中样式 */
  type?: 'line' | 'round' | 'plain' | (string & {})
  /** 当前选中项下标（可用 v-model:active 双向绑定） */
  active?: number
}

/** coolui-scroller-nav-bar 属性 */
export interface CooluiScrollerNavBarProps {
  /** default 为内置返回按钮样式，其它值完全使用插槽 */
  type?: 'default' | (string & {})
  /** 导航栏配置 */
  config?: CooluiNavBarConfig
}

/** coolui-scroller-nav-pannel 属性 */
export interface CooluiScrollerNavPannelProps {
  /** 当前显示第几个 scroller */
  active?: number
  /** 切换时是否使用过渡动画 */
  animation?: boolean
  /** 切换方式：side(横向并排) / fade(叠层淡入) */
  type?: 'side' | 'fade' | (string & {})
}

/** 搜索组件右侧按钮配置 */
export interface CooluiScrollerSearchButton {
  /** 是否一直显示 */
  show?: boolean
  /** 是否一直隐藏 */
  hide?: boolean
  /** 按钮文字 */
  text?: string
}

/** coolui-scroller-search 属性 */
export interface CooluiScrollerSearchProps {
  /** 占位文字 */
  placeholder?: string
  /** 右侧按钮配置 */
  button?: CooluiScrollerSearchButton
  /** 是否圆角 */
  round?: boolean
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 搜索关键字（原生为 key，Vue 中 key 为保留字，故命名为 keyword；支持 v-model:keyword） */
  keyword?: string
}

/** coolui-scroller-sort 属性 */
export interface CooluiScrollerSortProps {
  /** 是否显示下拉遮罩 */
  overlay?: boolean
  /** 遮罩动画时长(ms) */
  overlayDuration?: number
  /** 是否开启横向滚动 */
  scroll?: boolean
}

/** 筛选/排序选项 */
export interface CooluiSortOption {
  id?: string | number
  title?: string
  [key: string]: unknown
}

/** coolui-scroller-sort-item 属性 */
export interface CooluiScrollerSortItemProps {
  /** 头部标题 */
  title?: string
  /** 下拉唯一标识（同一 sort 内不可重复） */
  name?: string
  /** 类型：sort(排序) / classify(分类) / diy(自定义) */
  type?: 'sort' | 'classify' | 'diy' | (string & {})
  /** 选中值：单选为 index，多选为逗号分隔的 index 字符串（支持 v-model:value） */
  value?: string | number
  /** 选项列表 */
  options?: CooluiSortOption[]
  /** 未选中文字颜色 */
  color?: string
  /** 选中文字颜色（同时作为确认按钮背景色） */
  activeColor?: string
  /** 是否多选 */
  multiple?: boolean
  /** 是否显示操作按钮（清空/确定） */
  actionBar?: boolean
}

/** 下拉二楼 tip 提示配置 */
export interface CooluiSecondFloorTip {
  /** 是否开启自动下拉提示 */
  show?: boolean
  /** 自动下拉高度 */
  height?: number
  /** 自动下拉次数 */
  times?: number
  /** 自动下拉速度(ms) */
  duration?: number
}

/** coolui-scroller-second-floor 属性 */
export interface CooluiScrollerSecondFloorProps {
  /** 拖拽进度（支持 v-model:threshold） */
  threshold?: number
  /** 偏移量 */
  offset?: number
  /** 二楼初始位置居中 */
  center?: boolean
  /** 二楼初始位置在底部（默认） */
  bottom?: boolean
  /** 二楼初始位置在顶部 */
  top?: boolean
  /** 二楼展开时是否开启缩放动画 */
  scale?: boolean
  /** 进入页面时的自动下拉提示 */
  tip?: CooluiSecondFloorTip
}

/** coolui-scroller-second-floor-refresh 属性 */
export interface CooluiScrollerSecondFloorRefreshProps {
  /** 刷新文案配置 */
  refreshConfig?: CooluiSecondFloorRefreshConfig
  /** 返回首页状态下的背景色（不传则无背景） */
  backBgColor?: string
}

/** coolui-scroller-handtip 属性 */
export interface CooluiScrollerHandtipProps {
  /** 顶部提示文案 */
  top?: string
  /** 底部提示文案 */
  bottom?: string
  /** 左侧提示文案 */
  left?: string
  /** 右侧提示文案 */
  right?: string
  /** 存储 key，关闭后不再提示 */
  storageKey?: string
  /** 蒙层透明度 */
  opacity?: number
}

/* ------------------------------------------------------------------ *
 * 组件间通信（provide / inject）
 * ------------------------------------------------------------------ */

/** scroller 内部给子组件使用的注册对象（provide: 'cooluiScroller'） */
export interface CooluiScrollerApi {
  registerRefresh(node: CooluiRefreshApi): void
  unregisterRefresh(): void
  /** 刷新配置变化后同步到 scroller */
  syncRefreshConfig(): void
  registerBackToTop(node: CooluiBackToTopApi): void
  unregisterBackToTop(): void
  scrollToTop(): void
  /** 设置手动回弹 */
  settriggered(flag: boolean): Promise<void>
  /** 重新计算内容高度（并修复滚动失效） */
  recalculateHeight(): void
}

/** refresh 注册到 scroller 的 API（scroller 需要的最小集合） */
export interface CooluiRefreshApi {
  readonly type: string
  readonly mergedConfig: CooluiRefreshConfig
  setTriggered(flag: boolean): void
  changeThreshold(threshold: number): Promise<void>
  setLoading(flag: boolean): Promise<void>
  setRefreshstate(state: string): void
}

/** refresh 通过 provide('cooluiRefresh') 暴露给 parallax 的 API */
export interface CooluiRefreshProvideApi extends CooluiRefreshApi {
  registerParallax(node: CooluiParallaxApi): void
  unregisterParallax(node: CooluiParallaxApi): void
}

/** backToTop 暴露给 scroller 的 API */
export interface CooluiBackToTopApi {
  readonly threshold: number
  readonly delay: number
}

/** parallax 暴露给 refresh 的 API */
export interface CooluiParallaxApi {
  threshold: number
}

/** nav-pannel 暴露给 scroller 的 API（provide: 'cooluiNavPannel'） */
export interface CooluiNavPannelApi {
  registerScroller(): void
}

/** nav-bar 暴露给 second-floor 的 API */
export interface CooluiNavBarApi {
  readonly statusBarHeight: number
}

/** second-floor-refresh 暴露给 second-floor 的 API */
export interface CooluiSecondFloorRefreshApi {
  setScrollHeight(height: number): void
  setText(val: number): void
  setLoading(flag: boolean): void
  setDown(): void
  setSecondShow(flag: boolean): void
}

/** second-floor 暴露给子组件的 API（provide: 'cooluiSecondFloor'） */
export interface CooluiSecondFloorApi {
  registerRefresh(node: CooluiSecondFloorRefreshApi): void
  registerNavBar(node: CooluiNavBarApi): void
  back(callback?: boolean): Promise<void>
}

/** second-floor 通过 ref 暴露的实例 API（组件 defineExpose 的完整集合） */
export interface CooluiSecondFloorInstance extends CooluiSecondFloorApi {
  /** 手动触发回弹 */
  settriggered(): Promise<void>
  /** 重新初始化（重新测量尺寸并同步给刷新组件） */
  init(callback?: ((...args: unknown[]) => void) | null): void
}

/** back-to-top 通过 ref 暴露的实例 API */
export interface CooluiBackToTopInstance extends CooluiBackToTopApi {
  /** 手动回到顶部 */
  backToTop(): void
}

/** sort-item 暴露给 sort 的 API */
export interface CooluiSortItemApi {
  toggleDropdown(active: string | null): void
  confirm(): void
}

/** sort 暴露给 sort-item 的 API（provide: 'cooluiSort'） */
export interface CooluiSortApi {
  registerItem(node: CooluiSortItemApi): void
  unregisterItem(node: CooluiSortItemApi): void
  toggle(active: string | null): void
}
