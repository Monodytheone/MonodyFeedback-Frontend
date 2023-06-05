import axios from 'axios';

const instanceWithMasterAuth = axios.create({
    timeout: 10000, // 最多等10秒
})
instanceWithMasterAuth.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('masterJWT')}`
        return config
    },
    error => {
        return Promise.reject(error);
    }
)
export default instanceWithMasterAuth
