import router from '@/router';
import { Modal } from 'ant-design-vue';

/** 展示登录成功跳转提示框 */
export default function () {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    const modal = Modal.success({
        title: '登录成功，即将跳转至主页面',
        content: `${secondsToGo} 秒后自动跳转`,
        okText: '确定',
        okType: 'default',
        onOk: function () {
            router.push('/')
            hasJumped = true
        }
    });
    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后自动跳转`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        modal.destroy();
        if (hasJumped === false) {
            router.push('/')
        }
    }, secondsToGo * 1000);
}