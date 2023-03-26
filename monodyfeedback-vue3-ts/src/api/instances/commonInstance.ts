import axios from 'axios';

const commonInstance = axios.create({
    timeout: 10000, // 最多等10秒
})

export default commonInstance
