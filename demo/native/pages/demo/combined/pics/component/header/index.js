// pages/demo/combined/pics/component/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    tempFilePaths: null,
    list: [
      {
        id: 1,
        photo: 'https://test.wzs.pub/pic/pics/1.jpg',
        name: '苏雨瑶',
      },
      {
        id: 2,
        photo: 'https://test.wzs.pub/pic/pics/2.jpg',
        name: '苏雨瑶',
      },
      {
        id: 3,
        photo: 'https://test.wzs.pub/pic/pics/3.jpg',
        name: '苏雨瑶',
      },
      {
        id: 4,
        photo: 'https://test.wzs.pub/pic/pics/1.jpg',
        name: '苏雨瑶',
      },
      {
        id: 5,
        photo: 'https://test.wzs.pub/pic/pics/2.jpg',
        name: '苏雨瑶',
      },
      {
        id: 6,
        photo: 'https://test.wzs.pub/pic/pics/3.jpg',
        name: '苏雨瑶',
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseimage: function () {
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            tempFilePaths: res.tempFilePaths,
          })
        },
      })
    },
  },
})
