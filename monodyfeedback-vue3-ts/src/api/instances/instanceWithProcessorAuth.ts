import showModalAndJump from '@/common/showModalAndJump';
import axios from 'axios';

const instanceWithProccessorAuth = axios.create({
    timeout: 10000, // 最多等10秒
})
instanceWithProccessorAuth.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('processorJWT')}`
        return config
    },
    error => {
        return Promise.reject(error);
    }
)
export default instanceWithProccessorAuth
