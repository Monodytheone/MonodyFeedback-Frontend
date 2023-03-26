import { Modal } from 'ant-design-vue';

/** 展示失败提示框 */
export default function (message: string) {
    let secondsToGo = 5;
    const modal = Modal.error({
        title: message,
        content: `${secondsToGo} 秒后自动关闭`,
        okText: '确定',
        okType: 'danger',
    });
    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后自动关闭`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        modal.destroy();
    }, secondsToGo * 1000);
}