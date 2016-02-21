define('modules/widget/date/main', function(require, exports, module) {

  /**
   * http://bootstrap-datepicker.readthedocs.org/en/latest/options.html#autoclose
   */
  
  'use strict';
  
  var Vue = require('modules/lib/vue');
  
  var Select2Render = require('modules/common/select2render');
  
  $.fn.datepicker.dates['zh-CN'] = {
      days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      today: "今日",
      format: "yyyy年mm月dd日",
      weekStart: 1
  };
  
  Vue.component('date', {
      template: "<div class=\"input-group date \" :data-date=\"value\" data-date-format=\"yyyy-mm-dd\">\r\n    <input type=\"text\" :name=\"name\" class=\"form-control\" :value=\"value\" readonly>\r\n    <span class=\"input-group-btn\">\r\n        <button class=\"btn btn-info\" type=\"button\"><i class=\"fa fa-calendar\"></i></button>\r\n    </span>\r\n</div>\r\n",
      props: {
          /**
           * input 的name 值，必须
           */
          'name': {
              type: String,
              required: true
          },
          /**
           * 初始值
           */
          'value': String
      },
      ready: function ready() {
          _init(this);
      }
  });
  
  function _init(vm) {
      $(function () {
          _initDatePicker(vm);
      });
  }
  
  function _initDatePicker(vm) {
      $(vm.$el).datepicker({
          autoclose: true,
          language: 'zh-CN'
      });
  }

});
