/**
 * http://bootstrap-datepicker.readthedocs.org/en/latest/options.html#autoclose
 * TODO today等常量
 */

var Vue = require('lib/vue');

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
    template: __inline('main.html'),
    data: function() {
        return {
            jqDate: undefined
        };
    },
    props: {
        /**
         * input 的name 值，必须
         */
        'name': {
            type: String,
            required: true
        },
        /**
         * 初始值，yyyy-mm-dd 格式的字符串，默认为当前日期
         */
        'value': 'null',
        /**
         * input 的name 值，必须
         */
        'format': {
            type: String,
            'default': 'yyyy-mm-dd'
        },
        /**
         * http://bootstrap-datepicker.readthedocs.org/en/latest/options.html#id6
         * http://bootstrap-datepicker.readthedocs.org/en/latest/options.html
         * 1.指定日期：'2015-12-10'
         * 2.当前日期基础上计算： '+0d'
         */
        'startDate': String,
        /**
         * http://bootstrap-datepicker.readthedocs.org/en/latest/options.html#todaybtn
         * true, fase, 'linked'
         */
        'todayBtn': 'null'
    },
    methods: {
        /**
         * 对外广播：date值发生了变化
         */
        reportChange: function(name, val, oldVal) {
            this.$dispatch('valuechange', name, val, oldVal);
        },
    },
    watch: {
        /**
         * 由于在input中设置了v-model="vaule"，因此value值会双向绑定
         * 此处检测value变化了，则将input的值进行切换。
         */
        'value': function(val, oldVal) {
            // 触发date面板上的选择，尤其是初始值为undefined时，日期面板上是没有高亮选中态的
            this.jqDate.datepicker('update');

            this.reportChange(this.name, val, oldVal);
        },
    },
    ready: function() {
        this.jqDate = $(this.$el);

        var options = {
            autoclose: true,
            language: 'zh-CN',
            format: this.format
        };

        if (this.startDate) {
            options.startDate = this.startDate;
        }

        if (typeof this.todayBtn == 'boolean' || this.todayBtn && this.todayBtn === 'linked') {
            options.todayBtn = this.todayBtn;
        }


        this.jqDate.datepicker(options);

        // 如果input标签使用:value="value",则需要在下面事件时人为处理值，但如果设置了v-model="value"之后，已经是双向绑定了，则不需要再如此处理了
        // $(this.$el).on('changeDate', function(e) {
        //     `e` here contains the extra attributes
        //     注意这里很关键，在datepicker选择完成值，要设置value的值
        //     vm.value = e.format();
        // });

    }
});
