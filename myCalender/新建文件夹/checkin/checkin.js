// pages/checkin/checkin.js
let app = getApp();
let base_url = app.base_url;
let base_url1 = app.base_url1;
var opiens = wx.getStorageSync('UTR')
Page({
  data: {
    orderId:'', //订单号
    hidebtn: false
  },
  air: function () {
    wx.navigateTo({
      url: '/pages/air-conditioning/air-conditioning',
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId:options.orderId  //获取订单号
    })
    //请求数据
    wx.request({
      url: base_url+'/v2.0/userroom/currentRoom',
      header: {
        userId: opiens.UserId,
        token: opiens.Token
      },
      data: {
        dingdanid: this.data.orderId
      },
      method: 'GET',
      success: res => {
        console.log(res.data.Value)
        const now = res.data.Value
        this.setData({
          now
        })
        console.log(now)
        if (now.Type == "房主") {
        } else {
          this.setData({
            hidebtn: true
          })
        }
      },
    })

  },
  /* 下方按钮控件 */
  bindClickCheckin(e){
    let ctrlTarget=e.target;
     //点击退房
    if (ctrlTarget.id === 'btn6' || ctrlTarget.id === 'checkOut' || ctrlTarget.id === 'icon9'){
      wx.navigateTo({
        url: '/pages/Check/Check?EndDate=' + this.data.now.EndDate + "&OrderId="+ this.data.orderId, 
        // url:"/pages/Check/Check" 
      })
    }
    //点击空调
    if (ctrlTarget.id === 'airPage' || ctrlTarget.id === 'icon5' || ctrlTarget.id === 'btn2') {
      const names = this.data.orderId
      wx.navigateTo({
        url: '/pages/air-conditioning/air-conditioning?OrderId=' + names,  
        success:res=>{
          console.log(this.data.orderId)
        }
      })
    }
    //点击回家
    if (ctrlTarget.id === 'homePage' || ctrlTarget.id === 'icon7' || ctrlTarget.id === 'btn4') {
      wx.navigateTo({
        url: '/pages/goHome/goHome',
      })
    }
    //点击分享
    if (this.data.now.Type == "房主") {
      if (ctrlTarget.id === 'sharePage' || ctrlTarget.id === 'icon4' || ctrlTarget.id === 'btn1') {
        wx.navigateTo({
          url: '/pages/share/share?OrderId=' + this.data.orderId,
        })
      }
    }
    //点击评价
    if (ctrlTarget.id === 'content' || ctrlTarget.id === 'icon2' || ctrlTarget.id === 'btn5'){
      wx.navigateTo({
        url: '/pages/roomEvaluate/roomEvaluate',
      })
    }
  },
  // 扫码开门
  scan() {
    wx.scanCode({
      success: res => {
        // 获取扫码的url
        let url = res.result;
        console.log(url)
        // 截取url里面的参数（roomId）
        let obj = {};
        let reg = /[?&][^?&]+=[^?&]+/g;
        let arr = url.match(reg);
        if (arr) {
          arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            this.setData({ val })
          });

        }

        // 向后台请求数据（开房间）
        // console.log(val)
        var codes = this.data.val
        var jsonStr  = JSON.stringify(codes)
        console.log(jsonStr)
        wx.request({
          url: base_url + '/v2.0/open/opendoor',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            token: opiens.Token,
            userId: opiens.UserId,
          },
          data: jsonStr ,
          success: res => {
            console.log(res) //判断res
          },
          fail: function (err) {
            console.log(err)
          }

        })

      }
    })
  },
})