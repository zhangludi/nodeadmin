/**
 * 需要支持：
 * 1. 大数据，后台分页
 * 2. 少量数据全加载，前端分页
 *
 * 1. 原生table
 * 2. ajax动态加载生成
 *
 * TODO 支持desc和asc排序
 * $( selector ).DataTable();
 * $( selector ).dataTable().api();
 * new $.fn.dataTable.Api( selector );
 */

var Vue = require('lib/vue');
var Render = require('common/render');

Vue.component('datagrid', {
    template: __inline('main.html'),
    data: function() {
        return {
            jqTable: undefined, //table的jQuery对象
            tableId: undefined, // table的Id
            oTable: undefined, // datatables对象
        };
    },
    props: {
        /**
         * 列表的类型
         * 前台分页：front; 后台分页：server
         */
        type: {
            type: String,
            'default': 'front'
        },
        url: String,
        pagelength: {
            type: Number,
            'default': '10',
            coerce: function(val) {
                return parseInt(val, 10);
            }
        },
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        reload: function() {
            // https://datatables.net/reference/api/ajax.reload()
            this.oTable.api().ajax.reload(function(json) {
                // console.log('---', json);
            });
        },
        /**
         * 获得所有的数据，这些数据是在Ajax查询时返回的
         * @return {[type]} [description]
         */
        getAllData: function() {
            //var data = oTable.fnGetData(oTable.$('#row_'+obj)[0]);
            return this.oTable.fnGetData();
        },
        getDataById: function(key, value) {
            if (!key || !value) {
                return;
            }

            var allData = this.getAllData(),
                length = allData.length,
                result;

            for (var i = 0; i < length; i++) {
                if (allData[i][key] === value) {
                    result = allData[i];
                    break;
                }
            }

            return result;
        }
    },
    ready: function() {
        // 缓存该值，避免重复获取
        this.$set('jqTable', $('.datagrid-table', this.$el));

        // 初始化
        _init(this);
    }
});


function _init(vm) {
    $(function() {

        initDataGrid(vm);

    });
}

function initDataGrid(vm) {
    switch (vm.type) {
        case 'server':
            initAjaxServer(vm);
            break;
        default:
            initAjaxFront(vm);
            break;
    }
}

function initAjaxFront(vm) {
    // 配置
    var dataTableOptions = getAjaxOptions(vm.url, vm.items, vm.pagelength);
    if (typeof dataTableOptions !== 'object') {
        return;
    }

    var jqTable = vm.jqTable;

    // 开始生成datatables
    var oTable = jqTable.dataTable(dataTableOptions);
    vm.$set('oTable', oTable);

    // 获取并缓存table的id
    vm.$set('tableId', jqTable.attr('id'));

    // 渲染其他的控件
    renderOther(vm.tableId);
}

function initAjaxServer(vm) {
    // 配置
    var dataTableOptions = getAjaxOptions(vm.url, vm.items, vm.pagelength);
    if (typeof dataTableOptions !== 'object') {
        return;
    }

    //前端关闭列排序，因为没必要，如果一定要排序，则需要服务端排序之后再返回
    dataTableOptions.ordering = false;

    dataTableOptions.processing = true;

    /**
     * https://datatables.net/reference/option/serverSide
     * 服务器模式，在分页和查找时会重新去请求数据
     */
    dataTableOptions.serverSide = true;

    /**
     * https://datatables.net/reference/option/deferRender
     * 默认是 false 。即默认情况下，DataTables会将获得的数据全部渲染成 HTML 元素，但这种处理在大数据时会影响性能，尤其在 IE6-IE8。
     * 推荐在后台分页处理时，将其设置为 true，即延迟渲染，按需渲染。
     */
    // dataTableOptions.deferRender = true;

    /**
     * https://datatables.net/reference/option/destroy
     * Destroy any existing table matching the selector and replace with the new options. 
     * Default value: false.
     *
     * 如果某个table已经被渲染成了DataTables，是否采用销毁的方式来重渲染表格。
     */
    // dataTableOptions.destroy = true;

    // TODO 此处有待商榷，也可能是GET
    dataTableOptions.ajax.type = 'POST';

    // TODO 增加参数
    // https://datatables.net/examples/ajax/custom_data_property.html
    // dataTableOptions.ajax.dataSrc = 'data';

    // TODO 此处可以追加一些请求参数
    // dataTableOptions.ajax.data = function(d){
    //     d.myKey = "myValue";
    // };


    var jqTable = vm.jqTable;

    // 开始生成datatables
    var oTable = jqTable.dataTable(dataTableOptions);
    vm.$set('oTable', oTable);

    // 获取并缓存table的id
    vm.$set('tableId', jqTable.attr('id'));

    // 渲染其他的控件
    renderOther(vm.tableId);
};


/**
 * 默认的配置
 * @return {[type]} [description]
 */
function getDefaultOptions() {
    $.extend(true, $.fn.DataTable.TableTools.classes, {
        "container": "btn-group tabletools-dropdown-on-portlet",
        "buttons": {
            "normal": "btn btn-sm btn-default",
            "disabled": "btn btn-sm btn-default disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu tabletools-dropdown-menu"
        }
    });

    var options = {
        "order": [
            // [0, 'asc']
        ],

        "lengthMenu": [
            [10, 20, 50, -1],
            [10, 20, 50, "All"] // change per page values here
        ],

        /**
         * https://datatables.net/reference/option/pageLength
         * Change the initial page length (number of rows per page).
         * Default value: 10.
         *
         * 设置每一页展示多少条记录，最好在lengthMenu中定义了该值，否则会导致lengthMenu中没有选中的值
         */
        "pageLength": 10,

        "language": {
            "info": "第 _START_ 条到第 _END_ 条记录 (总计 _TOTAL_ 条记录)",
            "processing": "加载中，请稍后...",
            "search": "搜索: ",
            "infoFiltered": "从 _MAX_ 条记录过滤后的结果"
        },

        "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        "tableTools": {
            "sSwfPath": "/static/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "aButtons": [{
                "sExtends": "pdf",
                "sButtonText": "PDF"
            }, {
                "sExtends": "csv",
                "sButtonText": "CSV"
            }, {
                "sExtends": "xls",
                "sButtonText": "Excel"
            }, {
                "sExtends": "print",
                "sButtonText": "Print",
                "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                "sMessage": "Generated by DataTables"
            }]
        }
    };

    return options;
}

/**
 * 获得Ajax类型的 datagrid 配置
 * @return {[type]} [description]
 */
function getAjaxOptions(url, items, pagelength) {
    // url
    if (!url) {
        console.error('Unknown url', url);
        return;
    }

    // columns and columnDefs
    var columns = [],
        columnDefs = [];

    if (!items.length) {
        console.error('Unknown items', items);

        return;
    }

    var orderableArr = [],
        visibleArr = [],
        classNameMap = {};

    for (var i = 0; i < items.length; i++) {
        var item = items[i],
            columnOption = {
                'data': item.name,
                'title': item.title ? item.title : item.name
            };

        // 如果有自定义的render方法，则需要进行处理
        // TODO 考虑下此处是否有必要支持不同的render
        if (item.render) {
            var arr = item.render.split('|'),
                renderFn = arr[0].trim(),
                renderParam = arr[1];

            if (renderFn && Render[renderFn]) {
                columnOption.render = function(data, type, full) {
                    return Render[renderFn](renderParam, data, type, full);
                };
            }
        }

        // 如果需要增加样式类，则需要进行处理className
        if (item.css) {
            var existClassNameArr = classNameMap[item.css];
            if (!existClassNameArr) {
                existClassNameArr = [];
            }
            existClassNameArr.push(i);
            classNameMap[item.css] = existClassNameArr;
        }

        // 如果需要阻止排序，则需要进行处理orderable
        if (item.disableorder) {
            orderableArr.push(i);
        }

        // 如果需要隐藏它，则需要进行处理visible
        if (item.hide) {
            visibleArr.push(i);
        }


        columns.push(columnOption);
    }

    var classNameArr = Object.keys(classNameMap);
    if (classNameArr.length) {
        classNameArr.forEach(function(className) {
            columnDefs.push({
                'className': className,
                'targets': classNameMap[className]
            });
        });
    }

    if (orderableArr.length) {
        columnDefs.push({
            'orderable': false,
            'targets': orderableArr
        });
    }

    if (visibleArr.length) {
        columnDefs.push({
            'visible': false,
            'targets': visibleArr
        });
    }


    // 配置
    var dataTableOptions = getDefaultOptions();

    // 请求
    dataTableOptions.ajax = {
        "url": url
    };

    // columns
    dataTableOptions.columns = columns;

    // columnDefs
    if (columnDefs.length) {
        /**
         * https://datatables.net/reference/option/columnDefs
         * Set column definition initialisation properties.
         *
         * 非常像 columns，用于定义如何初始化属性，但它不要求每一列都要定义。因为下面的冲突规则，因此建议如果需要动态改变的，则使用 columnDefs 来定义，例如 visible 属性，这样便于控制。而且也方便集中批量配置。
         *
         * 定义冲突规则：
         * 1. columns 中的优先级要高
         * 2. columnDefs 中使用数组来定义的属性要比其他的定义的高，比如下例中第一列和第二列将显示，其他列隐藏
         * 
         */
        dataTableOptions.columnDefs = columnDefs;
    }

    // pagelength
    if (pagelength != 10) {
        dataTableOptions.pageLength = pagelength;

        // 如果指定的每页数量不在下拉框内，还要手动加入
        if (dataTableOptions.lengthMenu[0].indexOf(pagelength) < 0) {
            for (var i = 0; i < dataTableOptions.lengthMenu[0].length; i++) {
                if (dataTableOptions.lengthMenu[0][i] > pagelength || dataTableOptions.lengthMenu[0][i] === -1) {
                    dataTableOptions.lengthMenu[0].splice(i, 0, pagelength);
                    dataTableOptions.lengthMenu[1].splice(i, 0, pagelength);
                    break;
                }
            }
        }

        // "lengthMenu": [
        //     [10, 20, 50, -1],
        //     [10, 20, 50, "All"] // change per page values here
        // ],

    }

    return dataTableOptions;
}

/**
 * 渲染其他的控件
 * @param  {[type]} tableId [description]
 * @return {[type]}         [description]
 */
function renderOther(tableId) {
    // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    var tableWrapper = $('#' + tableId + '_wrapper');

    // initialize select2 dropdown
    tableWrapper.find('.dataTables_length select').select2();
}
