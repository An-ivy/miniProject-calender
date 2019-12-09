var app = getApp();
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentDateYear:'',
    currentDateYearMonth:'',
        startDate: '',
    endDate: '',
    date_click: 0,//判断是否是第二次点击
    beforeDate:''
  },
  onLoad: function (options) {

    //获取当前日期
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    this.setData({
      date,
      cur_year,
      cur_month,
      cur_day
    })

    // let month = this.data.cur_month.toString().length === 1 ? `0${this.data.cur_month}` : this.data.cur_month;
    // let day = this.data.cur_day.toString().length === 1 ? `0${this.data.cur_day}` : this.data.cur_day;
    let month = this.data.cur_month;
    let day = this.data.cur_day;
    let nowDate = `${cur_year}-${month}-${day}`;

    this.setData({
      nowDate,
      nowDateDate: cur_year + month + day
    })
    console.log("今天日期",this.data.nowDateDate)

    var currentObj = this.getCurrentDayString()
    console.log(currentObj)
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' ,
      beforeDate: currentObj.getFullYear()+ "-" + (currentObj.getMonth() + 1),
      currentDateYear: currentObj.getFullYear() ,
      currentDateYearMonth: currentObj.getMonth() + 1,
      currentDay: currentObj.getDate(),
      currentObj: currentObj
    })
    console.log("之前日期", this.data.beforeDate)
    this.setSchedule(currentObj)
    this.getHalfYear()
  },
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str)
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
      currentDateYear: currentObj.getFullYear(),
      currentDateYearMonth: currentObj.getMonth() + 1,
      currentObj: currentObj
    })
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    console.log(currentDayWeek)
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = ''
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1
          f = currentDayList[i]
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
    console.log(that.data.currentDayList)
  }, 
   /** 
   * 半年日期 **/
  getHalfYear() {
    wx.request({
      url: 'https://www.samewarm.com/Sandy/v2.0/userroom/halfDays',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res.data.Value)
        let _halfMonth = res.data.Value;
      }
    })
  },
/**
 * 点击日期
  */
  chooseDate(e){
    console.log(e)
    const year_click = this.data.currentDateYear;
    const month_click = this.data.currentDateYearMonth;
    const day_click = e.currentTarget.dataset.day;
    console.log(year_click, month_click, day_click);
    // let currentDateDay = e.currentTarget.dataset.day
    // console.log(this.data.currentDateYear, this.data.currentDateYearMonth, currentDateDay)
    // 如果是空格或者以前的日期就直接返回
    if (day_click === '' || `${year_click}-${month_click}-${day_click}` < this.data.nowDate) {
      console.log('不能选')
      return;
    }
    // data_click为0代表选择的是入住日期，否则就是离店日期
    if (this.data.date_click == 0) {
      // 选择入住日期
      this.setData({
        startDate: `${year_click}-${month_click}-${day_click}`,
        date_click: 1
      })
      console.log(this.data.startDate)
    } else {
      let newDay = new Date(Date.parse(id));
      let oldDay = new Date(Date.parse(this.data.startDate));

      // 判断第二次点击的日期在第一次点击的日期前面还是后面
      if (newDay > oldDay) {
        this.setData({
          endDate: `${year_click}-${month_click}-${day_click}`,
          date_click: 2
        })
      } else {
        this.setData({
          startDate: `${year_click}-${month_click}-${day_click}`,
          endDate: '',
          date_click: 1
        })
      }
    }
  }
})