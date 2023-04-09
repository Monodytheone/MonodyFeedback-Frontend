import axios from "axios";
import showOfflineModalAndJump from "@/common/showOfflineModalAndJump";
import showModalAndJump from "@/common/showModalAndJump";

/** 带有Processor的JWT的请求头，并拦截401和403的实例 */
const instanceWithProcessorAuthAnd401403Catch = axios.create({
    timeout: 10000,
})

// 请求拦截器，添加Authorization请求头
instanceWithProcessorAuthAnd401403Catch.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('processorJWT')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器，拦截401和403，将其跳转到登录界面
instanceWithProcessorAuthAnd401403Catch.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response.status == 401) {
            showModalAndJump(false, '/processor', '登录失效，请重新登陆', '处理者登录页面', '去登录')
            return
        }
        else if(error.response.status == 403) {
            showModalAndJump(false, '/processor', '你访问了你不配访问的方法，给你个机会重新登录', '处理者登录页面', '我错了')
            // 危险行为，需要记录到日志
            return
        }
        return Promise.reject(error);
    }
)

export default instanceWithProcessorAuthAnd401403Catch