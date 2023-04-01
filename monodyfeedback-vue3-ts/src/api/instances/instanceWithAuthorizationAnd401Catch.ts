import axios from "axios";
import showOfflineModalAndJump from "@/common/showOfflineModalAndJump";

/** 带有Authorization请求头，并拦截401的实例 */
const instanceWithAuthorizationAnd401Catch = axios.create({
    timeout: 10000,
})

// 请求拦截器，添加Authorization请求头
instanceWithAuthorizationAnd401Catch.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器，拦截401，将其跳转到登录界面
instanceWithAuthorizationAnd401Catch.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response.status == 401) {
            showOfflineModalAndJump();
        }
        return Promise.reject(error);
    }
)

export default instanceWithAuthorizationAnd401Catch