/**
 * 需要支持：
 * 1. 大数据，后台分页
 * 2. 少量数据全加载，前端分页
 */

var Vue = require('lib/vue');
var App = require('common/app');

Vue.component('datagrid', {
    template: __inline('main.html'),
    data: function() {
        return {
            tableElem: undefined, //table的jQuery对象
            tableId: undefined // table的Id
        };
    },
    ready: function() {
        // 缓存该值，避免重复获取
        this.$set('tableElem', $(this.$el));

        _init(this);
    }
});


function _init(vm) {
    $(function() {
        initTable(vm);
    });
}

var initTable = function(vm) {
    var tableElem = vm.tableElem;

    /* Table tools samples: https://www.datatables.net/release-datatables/extras/TableTools/ */

    /* Set tabletools buttons and button container */

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

    var oTable = tableElem.dataTable({
        "order": [
            [0, 'asc']
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
            "info": "当前展现第 _START_ 条到第 _END_ 条记录 (总计 _TOTAL_ 条记录)",
            "processing": "加载中，请稍后...",
            "search": "搜索: "
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
        },
        "ordering": false, //关闭列排序

        "processing": true,

        /**
         * https://datatables.net/reference/option/serverSide
         * 服务器模式，在分页和查找时会重新去请求数据
         */
        "serverSide": true,

        /**
         * https://datatables.net/reference/option/deferRender
         * 默认是 false 。即默认情况下，DataTables会将获得的数据全部渲染成 HTML 元素，但这种处理在大数据时会影响性能，尤其在 IE6-IE8。
         * 推荐在后台分页处理时，将其设置为 true，即延迟渲染，按需渲染。
         */
        // "deferRender": true,

        /**
         * https://datatables.net/reference/option/destroy
         * Destroy any existing table matching the selector and replace with the new options. 
         * Default value: false.
         *
         * 如果某个table已经被渲染成了DataTables，是否采用销毁的方式来重渲染表格。
         */
        // "destroy": true,
        "ajax": {
            // "url": "/static/mock/datagrid.json",           
            "url": "https://www.datatables.net/examples/server_side/scripts/post.php",            
            "type": "POST",
            "data": function(d) {
                d.myKey = "myValue";
                // d.custom = $('#myInput').val();
                // etc
                // 此处可以追加一些请求参数
            }
        },
        "columns": [{
            "data": "first_name"
        }, {
            "data": "last_name"
        }, {
            "data": "position"
        }, {
            "data": "office"
        }, {
            "data": "start_date"
        }, {
            "data": "salary"
        }]

        // "columnDefs": aoColumnDefs,
        // "columns": aoColumns
    });

    // 获取并缓存table的id
    vm.$set('tableId', tableElem.attr('id'));

    // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
    var tableWrapper = $('#' + vm.tableId + '_wrapper');

    // initialize select2 dropdown
    tableWrapper.find('.dataTables_length select').select2();
};