import { getUserInfo } from "@/api/identityAPIs/getUserInfo";
import showModalAndJump from "./showModalAndJump";

/** 检查登录状态，若未登录登录失效，跳转至登录界面 --- 用于需要登录才能访问的页面
*/
export default async function () {
    let jwt = localStorage.getItem('jwt');
    if (jwt == null) {
        showModalAndJump(false, '/login', '未登录', '登录页', '去登录')
        return;
    }

    await getUserInfo()
        .catch(error => {
            showModalAndJump(false, '/login',
                `${error.response.status}： ${error.response.data}`,  // 后端做了响应信息处理的，直接show给用户也无妨
                '登录页', '去登录')
        });
}
