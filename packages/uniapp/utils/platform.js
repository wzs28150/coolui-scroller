/**
 * 平台 API 适配层
 * 将微信小程序专有 API 统一封装为跨端可用的方法
 */

function noop() {}

/**
 * 获取节点查询对象（组件内使用）
 * @param {Object} component Vue 组件实例，不传则为页面级查询
 */
export function getSelectorQuery(component) {
  const query = uni.createSelectorQuery()
  if (component) {
    // uni-app Vue3 中传入的是 Vue 实例，需取其微信小程序原生组件实例 $scope 才能命中组件内部节点
    const ctx = component.$scope || component
    try {
      return query.in(ctx)
    } catch (e) {
      return query
    }
  }
  return query
}

/**
 * 获取窗口信息（windowHeight / statusBarHeight 等）
 */
export function getWindowInfo() {
  if (typeof uni.getWindowInfo === 'function') {
    try {
      return uni.getWindowInfo()
    } catch (e) {
      // ignore
    }
  }
  try {
    return uni.getSystemInfoSync()
  } catch (e) {
    return {}
  }
}

/**
 * 获取胶囊按钮位置（仅微信小程序等部分平台支持）
 * @returns {Object|null}
 */
export function getMenuButtonBoundingClientRect() {
  if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
    try {
      return uni.getMenuButtonBoundingClientRect()
    } catch (e) {
      return null
    }
  }
  return null
}

/** 短震动 */
export function vibrateShort() {
  try {
    uni.vibrateShort({ fail: noop })
  } catch (e) {
    // ignore
  }
}

/** 顶部导航栏加载动画（部分平台不支持，静默降级） */
export function showNavigationBarLoading() {
  try {
    if (typeof uni.showNavigationBarLoading === 'function') {
      uni.showNavigationBarLoading()
    }
  } catch (e) {
    // ignore
  }
}

export function hideNavigationBarLoading() {
  try {
    if (typeof uni.hideNavigationBarLoading === 'function') {
      uni.hideNavigationBarLoading()
    }
  } catch (e) {
    // ignore
  }
}

export function setStorageSync(key, value) {
  try {
    uni.setStorageSync(key, value)
  } catch (e) {
    // ignore
  }
}

export function getStorageSync(key) {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    return ''
  }
}

export function navigateBack(delta = 1) {
  try {
    uni.navigateBack({ delta, fail: noop })
  } catch (e) {
    // ignore
  }
}

/**
 * 创建交叉观察者（长列表分页用）
 * @param {Object} component 组件或页面实例
 */
export function createIntersectionObserver(component, options) {
  try {
    if (component && typeof uni.createIntersectionObserver === 'function') {
      return uni.createIntersectionObserver(component, options)
    }
    return uni.createIntersectionObserver(options)
  } catch (e) {
    return null
  }
}

/**
 * 对象深度合并（后者覆盖前者）
 */
export function deepMerge(target, source) {
  const result = { ...target }
  if (!source) {
    return result
  }
  Object.keys(source).forEach((key) => {
    const val = source[key]
    if (
      val &&
      Object.prototype.toString.call(val) === '[object Object]' &&
      result[key] &&
      Object.prototype.toString.call(result[key]) === '[object Object]'
    ) {
      result[key] = deepMerge(result[key], val)
    } else {
      result[key] = val
    }
  })
  return result
}

/**
 * 防抖执行器（组件内使用，timeout 保存在组件实例上）
 */
export function createDebouncer(component) {
  return function debounce(fn, wait) {
    if (component.__cooluiTimeout !== null && component.__cooluiTimeout !== undefined) {
      clearTimeout(component.__cooluiTimeout)
    }
    component.__cooluiTimeout = setTimeout(() => {
      fn()
      component.__cooluiTimeout = null
    }, wait)
  }
}
