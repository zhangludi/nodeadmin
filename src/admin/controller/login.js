'use strict';

import Base from './base.js';

export default class extends Base {
    async __before() {

        /**
         * ע������Ҫ��д����Ϊ��Base�������޶������û��¼����ת����¼ҳ��Ĵ���,
         * ����˴�����д��������뵽ѭ����
         */

    }

    /**
     * չʾ��¼ҳ��
     */
    async indexAction() {
        let userInfo = await this.session('userInfo');

        // ����Ѿ���¼�ˣ���ֱ�ӵ�ת����̨��ҳ
        if (!think.isEmpty(userInfo)) {
            return this.redirect('/admin');
        }

        return this.display();
    }

    /**
     * ��¼У��
     * 
     * @return {object} JSON���
     */
    async loginAction() {
        // ����У�飬��logic�������

        // �������������
        let {
            username, password
        } = this.post();

        // md5����
        let md5 = think.md5('think_' + password);

        // �����ݿ�������
        let result = await this.model('user').where({
            name: username,
            pwd: md5
        }).find();

        // �����¼ʧ�ܣ��򷵻�ʧ��
        if (think.isEmpty(result)) {
            // �Զ��������
            // https://thinkjs.org/zh-cn/doc/2.1/api_controller.html#toc-ff1
            // https://thinkjs.org/zh-cn/doc/2.1/controller.html#toc-1ab
            // https://thinkjs.org/zh-cn/doc/2.1/i18n.html#toc-d0f
            return this.fail('LOGIN_FAIL');
        }

        // ����ɹ����򱣴��û���Ϣ
        await this.session('userInfo', result);

        // ���سɹ�
        return this.success(result.name);
    }


    /**
     * �˳���¼
     */
    async logoutAction() {
        // ������session
        await this.session('userInfo', '');

        // ֱ����ת����¼ҳ
        return this.redirect('/admin/login');
    }
}