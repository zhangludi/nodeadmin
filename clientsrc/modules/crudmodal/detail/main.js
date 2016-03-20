var Vue = require('lib/vue');

var mixinsBasicModal = require('mixins/modal/basic/main');

Vue.component('crud-modal-detail', {
    template: __inline('main.html'),
    data: function() {
        return {
            items: []
        };
    },
    props: {
        /**
         * 数据
         */
        initData: {
            type: Object,
            required: true
        },
        /**
         * 字段定义字典，key为字段名，value为其显示的中文名
         */
        fieldDefine: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            'default': '详情'
        }
    },
    mixins: [mixinsBasicModal],
    methods: {
        beforeModal: function() {

            var filedNameArr = Object.keys(this.fieldDefine),
                result = [];

            filedNameArr.map(key => {
                result.push({
                    key: key,
                    value: this.initData[key],
                    title: this.fieldDefine[key]
                });
            });

            this.items = result;
        }
    }
});
