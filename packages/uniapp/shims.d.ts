/**
 * uni-app 内置组件声明
 *
 * uni-app 的 view / button / input / text 等与 HTML 同名元素语义不同（属性、事件都不一样），
 * 这里把它们声明为宽松类型，避免模板里出现与小程序无关的 HTML 类型报错
 * （例如 <button type="default"> 会被 HTML 的 button type 校验拦下）。
 * 如需严格的内置组件类型，可引入 @uni-helper/uni-app-types 并同步调整 tsconfig。
 */
declare module 'vue' {
  export interface GlobalComponents {
    view: any
    text: any
    button: any
    input: any
    image: any
    block: any
    'scroll-view': any
    'page-container': any
  }
}

export {}
