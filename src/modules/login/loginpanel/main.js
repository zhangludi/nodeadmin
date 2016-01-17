var Vue = require('lib/vue');

var TipAlert = require('widget/tipalert/main');

module.exports = Vue.extend({
    template: __inline('main.html'),
    components: {
        TipAlert
    },
    ready: function() {
        handleLogin(this);
        handleUniform();
    }
});

var handleLogin = function(vm) {
    $('.login-form').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            },
            remember: {
                required: false
            }
        },

        messages: {
            username: {
                required: "用户名不能为空！"
            },
            password: {
                required: "密码不能为空！"
            }
        },

        invalidHandler: function(event, validator) { //display error alert on form submit   
            vm.$refs.alert.show('登录失败，请输入正确的用户名和密码！');
        },

        highlight: function(element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function(error, element) {
            error.insertAfter(element.closest('.input-icon'));
        },

        submitHandler: function(form) {
            form.submit();
        }
    });

    $('.login-form input').keypress(function(e) {
        if (e.which == 13) {
            if ($('.login-form').validate().form()) {
                $('.login-form').submit();
            }
            return false;
        }
    });
}

var handleUniform = function() {
    if (!jQuery().uniform) {
        return;
    }
    var test = $("input[type=checkbox]:not(.toggle, .make-switch), input[type=radio]:not(.toggle, .star, .make-switch)");
    if (test.size() > 0) {
        test.each(function() {
            if ($(this).parents(".checker").size() == 0) {
                $(this).show();
                $(this).uniform();
            }
        });
    }
}