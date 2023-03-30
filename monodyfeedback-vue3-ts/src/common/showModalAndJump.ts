import router from '@/router';
import { Modal } from 'ant-design-vue';

export default function (isSuccessful: boolean, routerPath: string, message: string, routerTargetName: string, okText: string) {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    let modal: any
    if (isSuccessful === true) {
        modal = Modal.success({
            title: message,
            content: `${secondsToGo} 秒后跳转至${routerTargetName}`,
            okText: okText,
            okType: "default",
            onOk: function () {
                router.push(routerPath)
                hasJumped = true
            }
        });
    }
    else {
        modal = Modal.error({
            title: message,
            content: `${secondsToGo} 秒后跳转至${routerTargetName}`,
            okText: okText,
            okType: "danger",
            onOk: function () {
                router.push(routerPath)
                hasJumped = true
            }
        });
    }


    const interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo} 秒后跳转至${routerTargetName}`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        modal.destroy();
        if (hasJumped === false) {
            router.push(routerPath)
        }
    }, secondsToGo * 1000);
}