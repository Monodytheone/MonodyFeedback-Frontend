import router from '@/router';
import { Modal } from 'ant-design-vue';

/** 展示提交成功提示框并跳转至服务进度页面 */
export default function () {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    const modal = Modal.success({
        title: '提交成功',
        content: `${secondsToGo} 秒后关闭`,
        okText: '确定',
        onOk: function () {
            router.push('/progress')
            hasJumped = true
        }
    });
    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后关闭`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        modal.destroy();
        if (hasJumped === false) {
            router.push('/progress')
        }
    }, secondsToGo * 1000);
}