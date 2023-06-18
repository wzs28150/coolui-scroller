import { makeNoise2D } from './lib/mod'
const noise2D = makeNoise2D(Date.now())
Component({
  properties: {
    // 颜色
    color: {
      type: String,
      value: '#d13435',
    },
    // 高度百分比
    percent: {
      type: Number,
      value: 50,
    },
    // 填充位置
    position: {
      type: String,
      value: 'top',
    },
    // 振幅
    amp: {
      type: Number,
      value: 20,
    },
  },
  methods: {
    init(res) {
      const canvas = res[0].node
      this.canvas = this.c = canvas
      this.w = res[0].width
      this.h = res[0].height
      this.speedY = 0
      this.speedX = 0
      this.ctx = canvas.getContext('2d')
      this.reset()
      this.loop()
    },
    reset() {
      this.canvas.width = this.w
      this.canvas.height = this.h
      this.count = Math.floor(this.w / 5)
    },
    render() {
      let ctx = this.ctx
      ctx.clearRect(0, 0, this.w, this.h)
      this.speedX = 0
      this.speedY += 0.003
      this.wave(this.data.color, 30, (this.h * this.data.percent) / 100, 1)
    },
    loop() {
      const that = this
      let canvas = this.canvas
      const renderLoop = () => {
        that.render()
        canvas.requestAnimationFrame(renderLoop)
      }
      canvas.requestAnimationFrame(renderLoop)
    },
    wave(color, amp, height) {
      let ctx = this.ctx
      ctx.beginPath()
      for (var i = 0; i <= this.count; i++) {
        this.speedX += 0.05
        var x = i * (this.w / this.count)
        var y = height + noise2D(this.speedX, this.speedY) * amp
        this.ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y)
      }
      ctx.lineTo(this.w, this.data.position == 'top' ? -this.h : this.h)
      ctx.lineTo(0, this.data.position == 'top' ? -this.h : this.h)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    },
  },
  ready() {
    wx.createSelectorQuery()
      .in(this)
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))
  },
})
