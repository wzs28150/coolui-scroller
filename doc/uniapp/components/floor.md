# SecondFloor 下拉二楼组件

`<coolui-scroller-second-floor>` 实现「下拉二楼」：下拉到阈值后进入第二个页面（二楼），支持居中、上下方向、缩放等效果。二楼内容的刷新动画用 `<coolui-scroller-second-floor-refresh>`，顶部导航栏用 [`coolui-scroller-nav-bar`](/uniapp/components/navBar)。

> 对应原生微信小程序版：[SecondFloor 下拉二楼组件](/native/components/floor)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller-second-floor
    ref="mySecondFloor"
    :threshold="threshold"
    :offset="offset ? 100 : 0"
    :center="type === 'center'"
    :bottom="type === 'bottom'"
    :top="type === 'top'"
    :scale="scale"
    :tip="tip"
    @refresh="onRefresh"
    @secondShow="onSecondShow"
    @secondBack="onSecondBack"
  >
    <!-- 二楼内容 -->
    <template #second-floor>
      <view class="second-floor">二楼</view>
    </template>

    <!-- 二楼下拉刷新 -->
    <template #second-floor-refresh>
      <coolui-scroller-second-floor-refresh :refreshConfig="refreshConfig" />
    </template>

    <!-- 二楼顶部导航栏 -->
    <template #nav-bar>
      <coolui-scroller-nav-bar :config="navBarConfig">下拉二楼</coolui-scroller-nav-bar>
    </template>

    <!-- 一楼内容（默认插槽） -->
    <view class="demopage">一楼内容</view>
  </coolui-scroller-second-floor>
</template>
```

## SecondFloor 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| threshold | 下拉进度 0~1，支持 `v-model:threshold` | _Number_ | `0` |
| offset | 触发偏移量 | _Number_ | `0` |
| center | 二楼内容是否居中 | _Boolean_ | `false` |
| bottom | 从底部下拉 | _Boolean_ | `true` |
| top | 从顶部下拉 | _Boolean_ | `false` |
| scale | 是否开启缩放效果 | _Boolean_ | `false` |
| tip | 自动下拉提示 `{ show, height, times, duration }` | _Object_ | `{ show: false, height: 100, times: 1, duration: 2000 }` |

## SecondFloor 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| refresh | 二楼下拉刷新触发 | — |
| secondShow | 进入二楼 | — |
| secondBack | 返回一楼 | — |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| second-floor | 二楼内容 |
| second-floor-refresh | 二楼的下拉刷新动画 |
| nav-bar | 二楼顶部导航栏 |
| 默认 | 一楼内容 |

## SecondFloor 实例方法

通过 `ref` 获取组件实例后调用：

| 方法 | 说明 |
| --- | --- |
| back(callback?) | 返回一楼 |
| settriggered() | 手动回弹（配合刷新组件不自动回弹的场景） |
| init(callback?) | 初始化 |

## SecondFloorRefresh 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| refreshConfig | 文案与颜色配置 `{ downText, loadingText, backText, tipText, moreText, color }` | _Object_ | `{}` |
| backBgColor | 返回按钮背景色（**uni-app 版新增**） | _String_ | `''` |

## 与原生版的差异

- `second-floor` 的属性与事件和原生一致，组件通信由原生 `relations` 改为 `provide/inject`；
- `second-floor-refresh` 新增 `backBgColor`；原生 `externalClasses`（`second-floor-refresh-class` / `second-floor-refresh-back`）已移除，页面里用 `:deep()` 覆盖样式。

## 相关

- [NavBar 顶部导航栏](/uniapp/components/navBar) · [示例：下拉二楼](/case/case3)
