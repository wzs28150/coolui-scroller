import{_ as s,o as a,c as l,O as o}from"./chunks/framework.83b1ca13.js";const n="/coolui-scroller/v3/images/wx.jpg",p="/coolui-scroller/v3/images/zfb.jpg",e="/coolui-scroller/v3/images/demo.jpg",t="/coolui-scroller/v3/images/set1.png",c="/coolui-scroller/v3/images/set2.png",b=JSON.parse('{"title":"coolui-scroller","description":"","frontmatter":{},"headers":[],"relativePath":"guide.md","filePath":"guide.md"}'),r={name:"guide.md"},i=o(`<h1 id="coolui-scroller" tabindex="-1">coolui-scroller <a class="header-anchor" href="#coolui-scroller" aria-label="Permalink to &quot;coolui-scroller&quot;">​</a></h1><p><a style="display:inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/v/coolui-scroller.svg" alt="Version"></a>  <a style="display:inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/l/coolui-scroller.svg" alt="License"></a>  <a style="display:inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/dt/coolui-scroller" alt="Download"></a>  <a style="display:inline-block;" href="https://github.com/wzs28150/coolui-scroller"><img src="https://img.shields.io/github/stars/wzs28150/coolui-scroller?style=social" alt="Stars"></a></p><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><h3 id="初衷" tabindex="-1">初衷 <a class="header-anchor" href="#初衷" aria-label="Permalink to &quot;初衷&quot;">​</a></h3><p>本来写这个组件的初衷，是在我写了一个小程序之后，发现小程序如果要实现下拉刷新、上拉加载有两种方式:</p><ol><li>页面级的：利用页面 Page 里提供的方法。下拉虽说是那个东西但是它只有下拉三个点的动画效果而且只能显示在头部就很尴尬。很多时候一个列表的头部往往会有一些组件比如搜索、分类导航等等。所以往往列表都是局部的非页面级的。这时候下拉时动画出现在最顶部就显得很突兀。</li></ol><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">Page</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">onPullDownRefresh</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 监听用户下拉刷新事件。</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">onReachBottom</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 监听用户上拉触底事件。</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">onPageScroll</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 监听用户滑动页面事件。</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><ol start="2"><li>组件级的：利用 scroll-view。 但是当你打开 scroll-view 官方文档时，映入眼帘的是一列列的参数属性方法。要完全弄懂里面的内容，恐怕你得上手写写，挨个试试里面的参数和方法才行。而对于下拉刷新这个效果文档上有个简易的 demo 可寻。上拉加载也只有 bindscrolltolower 这么个方法和 lower-threshold 阈值。所以要实现起来完全还得靠自己。</li></ol><p>所以在写项目的最后我把页面的列表下拉刷新,上拉加载进行了初步的封装。单独拿出来方便之后重复使用。所以有了起初的 1.0 版。</p><h3 id="发展" tabindex="-1">发展 <a class="header-anchor" href="#发展" aria-label="Permalink to &quot;发展&quot;">​</a></h3><h4 id="v2-0" tabindex="-1">V2.0 <a class="header-anchor" href="#v2-0" aria-label="Permalink to &quot;V2.0&quot;">​</a></h4><p>scroll-view 组件初期并没有那么多配置,所以 1.0 实现的效果很有限。 后来随着官方 scroll-view 组件的不断的更新。增加了很多新的属性和事件使得下拉可以自定义起来。虽然也有很多地方不尽人意，但是可玩度还是有很多的。所以又升级了 2.0 版增加了很多下拉的自定义动画效果和上拉加载的效果。</p><p>2.0 版组件还是围绕着 scroll-view,写法上只有一个封装好的 scroller 组件。内置了一个基础的下拉效果。提供下拉的插槽位置。并给出了几个有趣的下拉效果 demo(如：天猫效果、京东小人效果)让下拉又有了更多的可能性;配置上也考虑了很多增加了列表为空时的设置上拉加载的配置。整个配置就是一个 Obj,细化到文字、背景。</p><p>V2.0 配置：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// data 中配置</span></span>
<span class="line"><span style="color:#FFCB6B;">scroll</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">//  设置分页信息</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">pagination</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">page</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">totalPage</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">10</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">limit</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">10</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">length</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">100</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 设置数据为空时的图片</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">empty</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">img</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">http://coolui.coolwl.cn/assets/mescroll-empty.png</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 设置下拉刷新</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">refresh</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">default</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">style</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">black</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">background</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#000</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 设置上拉加载</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">loadmore</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">default</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">icon</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">http://upload-images.jianshu.io/upload_images/5726812-95bd7570a25bd4ee.gif</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">background</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">#f2f2f2</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// backgroundImage: &#39;http://coolui.coolwl.cn/assets/bg.jpg&#39;,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#FFCB6B;">title</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#FFCB6B;">show</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#FFCB6B;">text</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">加载中</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#FFCB6B;">color</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#999</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#FFCB6B;">shadow</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">5</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">},</span></span></code></pre></div><p>之后由于疫情及个人原因这个组件搁置了一阵子。当我再次打开它时便有了重构的想法。</p><h4 id="v3-0" tabindex="-1">V3.0 <a class="header-anchor" href="#v3-0" aria-label="Permalink to &quot;V3.0&quot;">​</a></h4><p>3.0 版打算把之前各个部分的插槽进行细化及拆分。并新增空列表插槽及组件、初次进入程序时的手势提示组件、顶部插槽及顶部插槽可用的组件(如：搜索组件、分类组件、下拉筛选组件)。</p><p>除了组件的变化外，核心列表准备加入长列表处理，解决数据量大时列表会出现的问题(如：setData 加载大数据的耗时高、列表渲染出来的 Dom 结构多、占用的内存高，造成页面被系统回收的概率变大等)。起初想以官方给出的 recycle-view 组件进行扩展。但是使用中，遇到很多坑及不方便之处。最让我接受不了的是需要设置 itemSize 这个方法。当我在不确定列表元素宽高的时候就很难设置。后来经过大量的思考和查资料及尝试。决定采用知乎上 daisy 提出的长列表解决方案。</p><p>该组件还在开发中各组件陆续上线~</p><h3 id="v3-0-版" tabindex="-1">v3.0 版 <a class="header-anchor" href="#v3-0-版" aria-label="Permalink to &quot;v3.0 版&quot;">​</a></h3><ol><li>基于小程序原生组件 scroll-view 的扩展与封装,实现简单的上拉加载下拉刷新</li><li>扩展下拉刷新动画，有灵感的朋友可以丰富更多下拉动画</li><li>上传至 npm 包可安装下载并 npm 构建</li><li>修改参数配置使组件使用更便捷</li><li>增加加载插槽可以自定义加载更多样式</li><li>增加多组件配合使列表功能更丰富</li></ol><h3 id="开发进度" tabindex="-1">开发进度 <a class="header-anchor" href="#开发进度" aria-label="Permalink to &quot;开发进度&quot;">​</a></h3><ol><li><s>调整为虚拟长列表模式</s></li><li><s>支持多组件搭配，使插件更灵活</s></li><li><s>新增组件 coolui-scroller-item(列表项组件)</s></li><li><s>新增组件 coolui-scroller-page(长列表分页组件)</s></li><li><s>新增组件 coolui-scroller-empty(空列表组件)</s></li><li><s>新增组件 coolui-scroller-handtip(手势提示组件)</s></li><li><s>新增组件 coolui-scroller-loadmore(加载更多组件)</s></li><li><s>新增组件 coolui-scroller-nav(分类导航组件)</s></li><li><s>新增组件 coolui-scroller-refresh(下拉刷新组件)</s></li><li><s>新增组件 coolui-scroller-parallax(下拉刷新视差位移组件)</s></li><li><s>新增组件 coolui-scroller-search(搜索组件)</s></li><li><s>新增组件 coolui-scroller-sort(分类筛选及排序组件)</s></li><li><s>新增组件 coolui-scroller-floor(下拉二楼组件)</s></li></ol><h3 id="支持-coolui-scroller" tabindex="-1">支持 coolui-scroller <a class="header-anchor" href="#支持-coolui-scroller" aria-label="Permalink to &quot;支持 coolui-scroller&quot;">​</a></h3><p>做一个组件库是一个繁琐且长期的事情，接下来我将花费业余时间进行多版本的完善。 如果 coolui-scroller 对您的工作或者学习有所帮助，您可以捐赠 coolui-scroller 的研发工作，捐赠无门槛，哪怕是一瓶肥宅快乐水，也可以帮助我多敲半小时代码。</p><table><thead><tr><th>微信</th><th>支付宝</th></tr></thead><tbody><tr><td><img src="`+n+'"></td><td><img src="'+p+'"></td></tr></tbody></table><h2 id="示例-demo" tabindex="-1">示例 demo <a class="header-anchor" href="#示例-demo" aria-label="Permalink to &quot;示例 demo&quot;">​</a></h2><p>请微信扫码打开小程序查看</p><img src="'+e+'" alt="示例"><p>示例代码： <a href="https://github.com/wzs28150/coolui-scroller/tree/master/empty" target="_blank" rel="noreferrer">https://github.com/wzs28150/coolui-scroller/tree/master/empty</a></p><p>请 clone 下载到本地使用微信开发者工具加载 demo 文件夹查看</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">git clone https://github.com/wzs28150/coolui-scroller.git</span></span></code></pre></div><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><h3 id="npm-安装" tabindex="-1">npm 安装 <a class="header-anchor" href="#npm-安装" aria-label="Permalink to &quot;npm 安装&quot;">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm i coolui-scroller --production</span></span></code></pre></div><h3 id="npm-构建" tabindex="-1">npm 构建 <a class="header-anchor" href="#npm-构建" aria-label="Permalink to &quot;npm 构建&quot;">​</a></h3><p>安装之后开发者工具点击 npm 构建:<br><img src="'+t+'" alt="npm构建1"><br> 当看到站点里面出现 miniprogram_npm 文件夹就算安装完成了<br><img src="'+c+`" alt="npm构建1"></p><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><h3 id="_1-调用组件" tabindex="-1">1.调用组件 <a class="header-anchor" href="#_1-调用组件" aria-label="Permalink to &quot;1.调用组件&quot;">​</a></h3><p>在<code>app.json</code>或<code>index.json</code>中引入组件</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">usingComponents</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scroller</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">coolui-scroller/scroller/index</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h3 id="_2-页面结构" tabindex="-1">2.页面结构 <a class="header-anchor" href="#_2-页面结构" aria-label="Permalink to &quot;2.页面结构&quot;">​</a></h3><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">scroller</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">my-scroller</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">scroller</span><span style="color:#89DDFF;">&gt;</span></span></code></pre></div><h3 id="_3-配置" tabindex="-1">3.配置 <a class="header-anchor" href="#_3-配置" aria-label="Permalink to &quot;3.配置&quot;">​</a></h3><p>在 js 的 data 中进行配置参数设置，v3.0 版将功能细化到各个组件中具体配置详见(<a href="./components/scroller.html">组件</a>)</p><h3 id="_4-组件" tabindex="-1">4.组件 <a class="header-anchor" href="#_4-组件" aria-label="Permalink to &quot;4.组件&quot;">​</a></h3><p>根据自己的业务场景选用组件，也可以在对应的插槽中自定义</p>`,48),F=[i];function y(D,h,d,u,m,C){return a(),l("div",null,F)}const A=s(r,[["render",y]]);export{b as __pageData,A as default};