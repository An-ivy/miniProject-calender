var util = require('../../utils/util.js');
var monthIndex = 0;
Page({
  data: {
    startDate: '', //开始年月日
    endDate: '', //结束年月日
    startDateHour: '', //开始年月日时
    endDateHour: '', //结束年月日时
    start_hourtime_click: '', //开始小时
    end_hourtime_click: '', //结束小时数
    times_id: 0, //日期点击次数标识
    hour_id: 0, //小时点击次数标识
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    lastMonth: 'lastMonth',
    isToday: 0,
    color: 'color',
    isTodayWeek: false,
    todayIndex: 0,
    text: "今天",
    nowDay: "nowDay", //蓝色的圆圈
    active: "active", //过去天数的颜色
    qttsfly: true, //记录其他时间的第一个下标
    qxtime: true, //判断点击没有点击时间
    qtOne: true, //获取到第一个下表之后就成false使用了
    newdays: true, //判断是否点击了当前天数
    myTime: true, //记录第一个时间值
    myTimeTime: true, //记录第一个时间值
    myTimeNo: true, //判断是否点击了小时数如果点击了就是false
    myTimeNoTime: true, //判断是否点击了小时数如果点击了就是false
    myTimeNoThree: true, //判断是否点击了小时数如果点击了就是false
    myTimeThree: true, //记录点击的第一个值
    hide: true,
    hideTime: true, //隐藏时间表
    dayFalase: true, //如果点击了其他天数今天就不能点击了
    hideTherr: true, //第三张数据表格隐藏
    dayGlDSj: true, //如果点击了今天然后点其他天数就让其他天数为false
    timesNote: true,
    timeDayqtts: true, //如果点击的不是今天，是其他天数只点了一天，他就为false
    kyFalese: true,
    kyTop: true, //这是跨月操作的话就是false
    kyky: true, //如果没有点本月的话他就为false
    // layFalse:true,//如果在其他月份点击了就让他false
    kyy: true, //如果没有点击本月他就true如果点击了本月就为false
    noday: true, //如果点击了下个月就不能返回本月
    kyfalseOne: true, //如果点击了本月跨月就是false必须点击时间才可以为true
    time: true, //开始时间
    timeEnd: true, //结束时间
    falsetTo: true, //判断是否点击过本月日期如果点击过就是false
    kydayTo: true, //kydayTo如果点击了其他月份的今天列入本月的28号其他月的28号就走这个方法
    // monethFalst:true//获取年月
    tt: true,
    text: '今天'
  },
  onLoad: function() { //首次加载
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const cc = now.getMonth() + 1; //当前月份
    const day = now.getDate() //当前日期
    // console.log(cc,day);
    this.setData({
      cur_time: now,
      cc, //月份
      day, //日期
      lastMonth: 'cc'
    })
    this.dateInit();
    var newDate = new Date()
    var nowHour = newDate.getHours(); //当前小时数
    console.log(nowHour)
    this.setData({
      year: year,
      month: month,
      nowHour,
      isToday: '' + year + '/' + month + '/' + now.getDate()
    })
    //length为“1”的日期加“0”
    let cur_month = this.data.month.toString().length === 1 ? `0${this.data.month}` : this.data.month,
      cur_day = this.data.day.toString().length === 1 ? `0${this.data.day}` : this.data.day,
      cur_hour = this.data.nowHour.toString().length === 1 ? `0${this.data.nowHour}` : this.data.nowHour
    let nowDate = `${year}-${cur_month}-${cur_day}`; //当前年月日
    let nowDateHour = `${year}-${cur_month}-${cur_day}-${cur_hour}`; //当前年月日时
    console.log(nowDate, nowDateHour)
    this.setData({
      nowDate,
      nowDateHour
    })
    this.getClier() //请求半年数据
  },
  /**
   * 请求半年数据
   */
  getClier() {
    wx.request({
      url: 'https://www.samewarm.com/Sandy/v2.0/userroom/halfDays',
      success: res => {
        let objsto = []
        let _halfMonth = res.data.Value;
        console.log(_halfMonth)
        // var mysty = []
        // let firstMonth = _halfMonth[0].Days;
        // for (let j = 0; j < firstMonth.length; j++) {
        //   mysty.push(firstMonth[j].Number)
        // }
        // this.setData({
        //   mysty
        // })
        // this.setData({
        //   week: _halfMonth[0].Days[0].Week
        // })
        //  this.Week()
        this.setData({ //保存半年时间
          _halfMonth,
          nowYearMonth: _halfMonth[0].Month, //显示当月
          _yearMonthDay: _halfMonth[0],
          week: _halfMonth[0].Days[0].Week
        })
        console.log(this.data.week)
        this.Week()
      }
    })
  },
  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          // isToday: '' + year + (month + 1) + num,
          isToday: (month + 1),
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 点击上一月
   * */
  lastMonth: function() {
    if (monthIndex > 0) { //判断是否小于总月数的长度
      monthIndex -= 1;
      console.log(this.data._halfMonth[monthIndex].Days[0].Week)
      this.setData({
        week: this.data._halfMonth[monthIndex].Days[0].Week
      })
      this.setData({
        _yearMonthDay: this.data._halfMonth[monthIndex],
        nowYearMonth: this.data._halfMonth[monthIndex].Month
      })
      this.Week()
    }
    // if (this.data.nowYearMonth == this.data.year + "-" + this.data.month) {
    //   this.setData({
    //     text:'今天',
    //     active: 'active'
    //   })
    // }
  },
  /**
   * //根据星期排列日期
   */
  Week() {
    console.log(this.data._yearMonthDay.Days)
    if (this.data.week == 1) {
      var none = [{
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
    }
    if (this.data.week == 2) {
      var none = [{
        Number: ' '
      }, {
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
    }
    if (this.data.week == 3) {
      var none = [{
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
    }
    if (this.data.week == 4) {
      var none = [{
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
    }
    if (this.data.week == 5) {
      var none = [{
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
    }
    if (this.data.week == 6) {
      var none = [{
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }, {
        Number: ' '
      }]
      var dateA = none.concat(this.data._yearMonthDay.Days)
      this.setData({
        dateA
      })
      console.log(dateA)
    }
    if (this.data.week == 7) {
      this.setData({
        dateA: this.data._yearMonthDay.Days
      })
      console.log(this.data.dateA)
    }
  },
  /**
   * 点击下一个月
   */
  nextMonth: function() {
    if (monthIndex < this.data._halfMonth.length) { //判断是否小于总月数的长度
      monthIndex += 1;
      console.log(this.data._halfMonth[monthIndex].Days[0].Week)
      this.setData({
        week: this.data._halfMonth[monthIndex].Days[0].Week
      })
      this.setData({
        _yearMonthDay: this.data._halfMonth[monthIndex], //要显示月份总数据
        nowYearMonth: this.data._halfMonth[monthIndex].Month //要显示的年月
      })
      this.Week()

    }
  },
  /**
   * 点击日期
   */
  chooseDate(e) {
    console.log(e)
    let number_click = e.currentTarget.dataset.number
    let date_click = e.currentTarget.dataset.date //获取点击的日期Date
    console.log(number_click, date_click, this.data.nowDate)
    // 如果是空格或者以前的日期就直接返回
    if (number_click === '' || date_click < this.data.nowDate) {
      console.log("不能选")
      return;
    }
    // times_id为0代表选择的是入住日期，否则就是离店日期
    if (this.data.times_id == 0) {
      //选择入住日期
      this.setData({
        startDate: date_click,
        times_id: 1
      })
      //生成时间表
      wx.request({
        url: 'http://192.168.10.198:8085/Sandy/v2.0/userroom/roomStatusOfDay',
        data: {
          day: this.data.startDate,
          roomId: 24
        },
        success: res => {
          console.log(res.data.Value)
          let data_schedule = res.data.Value; //时间表数据
          this.setData({
            data_schedule //保存时间表到数据中
          })
        }
      })
      console.log(this.data.hour_id)
    } else if (this.data.hour_id === 1) { //判断时间表标识，是否选择开始小时数
      let newDay = new Date(Date.parse(date_click)) // 第二次点击的日期
      let oldDay = new Date(Date.parse(this.data.startDate)) //第一次点击的日期
      console.log(newDay, oldDay)
      if (newDay >= oldDay) {
        this.setData({
          endDate: date_click,
          times_id: 2
        })
        //生成时间表
        wx.request({
          url: 'http://192.168.10.198:8085/Sandy/v2.0/userroom/roomStatusOfDay',
          data: {
            day: this.data.endDate,
            roomId: 24
          },
          success: res => {
            console.log(res.data.Value)
            let data_schedule = res.data.Value; //时间表数据
            this.setData({
              data_schedule //保存时间表到数据中
            })
          }
        })
      } else {
        this.setData({
          startDate: date_click,
          endDate: '',
          times_id: 1
        })
      }
    }
  },
  /**
   * 点击时间表
   */
  chooseHours(e) {
    console.log(e)
    let date_click = e.currentTarget.dataset.date
    let hourtime_click = e.currentTarget.dataset.hourtime
    console.log(date_click, hourtime_click)
    if (date_click < this.data.nowDateHour) {
      console.log("不能选")
      return;
    }
    // hour_id为0代表选择的是入住日期，否则就是离店日期
    if (this.data.hour_id == 0) { //第一次点击小时数
      this.setData({
        startDateHour: date_click, //开始年月日时
        start_hourtime_click: hourtime_click, //开始小时数
        hour_id: 1
      })
    } else { //第二次点击小时数
      console.log(this.data.startDate, this.data.endDate)
      if (this.data.endDate == '') {
        console.log("进来了")
        this.setData({
          endDate: this.data.startDate,
          times_id: 2
        })
      }
      var oldDayhour = this.data.startDateHour; //第一次点小时数
      var newDayhour = date_click; //第二次点小时数
      console.log(oldDayhour, newDayhour, oldDayhour < newDayhour)
      if (newDayhour > oldDayhour) { //判断第二次小时数是否大于第一次小时数
        console.log('123')
        this.setData({
          endDateHour: date_click, //结束年月日时
          end_hourtime_click: hourtime_click, //结束小时数
          hour_id: 2
        })
      } else {
        this.setData({
          startDateHour: date_click,
          start_hourtime_click: hourtime_click,
          endDateHour: '',
          end_hourtime_click: '',
          times_id: 1
        })
      }
    }
  }


  //确定按钮
  // Determine() {

  //   let moeny = this.data.jU1 || this.data.RlXb; //获取开始日期

  //   let jj = this.data.h1Time || this.data.h1; //开始小时数

  //   let sends = this.data.jU2 || this.data.jU1 //结束日期

  //   let yy = this.data.h2 || this.data.h2Time || this.data.h1Three //结束小时数
  //   if (yy < 10) {
  //     yy = "0" + yy
  //   }
  //   if (jj < 10) {
  //     jj = "0" + jj
  //   }
  //   if (moeny == undefined) {
  //     console.log("选择开始日期")
  //     wx.showToast({
  //       icon: 'loading',
  //       title: '选择开始日期',
  //     })
  //   } else if (jj == undefined) {
  //     console.log("请选择小时数")
  //     wx.showToast({
  //       icon: 'loading',
  //       title: '请选择小时数',
  //     })
  //   } else if (sends == undefined) {
  //     console.log("请选择结束日期")
  //     wx.showToast({
  //       icon: 'loading',
  //       title: '请选择结束日期或结束时间',
  //     })
  //   } else if (yy == undefined) {
  //     console.log("请选择结束时间")
  //     wx.showToast({
  //       icon: 'loading',
  //       title: '请选择结束日期或结束时间',
  //     })
  //   } else {
  //     wx.showToast({
  //       icon: 'loading',
  //       title: '跳转的路径',
  //     })
  //   }
  // },
  //清空数据

})