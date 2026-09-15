Page({
  data: {},
  reset(){
    console.log(1);
    try {
      wx.removeStorageSync('hand2')
      wx.navigateBack({
        delta: 1,
        success:()=>{
          wx.navigateTo({
            url:"/pages/hand/index"
          })
        }
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  onShareAppMessage: function () {}
})