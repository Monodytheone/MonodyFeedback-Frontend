import { getUserInfo } from "@/api/identityAPIs/getUserInfo";
import router from '@/router';
import { Modal } from 'ant-design-vue';

/** 检查登录状态，若未登录登录失效，跳转至登录界面 --- 用于需要登录才能访问的页面
*/
export default async function () {
    let jwt = localStorage.getItem('jwt');
    if (jwt == null) {
        showErrorModalAndJumpToLoginPage('未登录')
        return;
    }

    await getUserInfo()
        .catch(error => {
            showErrorModalAndJumpToLoginPage(`${error.response.status}： ${error.response.data}`);  // 后端做了响应信息处理了，直接show给用户也无妨
        });
}

function showErrorModalAndJumpToLoginPage(message: string) {
    let secondsToGo = 5;
    let hasJumped: boolean = false  // 是否已经跳转过页面了
    const modal = Modal.warning({
        title: message,
        content: `${secondsToGo} 秒后跳转至登录页`,
        okText: '去登录',
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