import router from '@/router';
import { Modal } from 'ant-design-vue';

/** 展示提交成功提示框并跳转至服务进度页面 */
export default function () {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    const modal = Modal.success({
        title: '注册成功',
        content: `${secondsToGo} 秒后跳转至登录页面`,
        okText: '去登录',
        okType: 'default',
        onOk: function () {
            router.push('/login')
            hasJumped = true
        }
    });
    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后跳转至登录页面`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        modal.destroy();
        if (hasJumped === false) {
            router.push('/login')
        }
    }, secondsToGo * 1000);
}