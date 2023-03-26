import axios from 'axios';

const instanceWithAuthorization = axios.create({
    timeout: 10000, // 最多等10秒
})
instanceWithAuthorization.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt')}`
        return config
    },
    error => {
        return Promise.reject(error);
    }
)
export default instanceWithAuthorization
