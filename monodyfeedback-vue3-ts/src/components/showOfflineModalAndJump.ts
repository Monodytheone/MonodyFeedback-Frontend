import router from '@/router';
import { Modal } from 'ant-design-vue';

/** 展示登录状态失效提示框并跳转至登录页面 */
export default function () {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    const modal = Modal.warning({
        title: '登录失效，请重新登陆',
        content: `${secondsToGo} 秒后跳转至登录页`,
        okText: '确定',
        onOk: function () {
            router.push('/login')
            hasJumped = true
        }
    });
    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后跳转至登录页`,
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