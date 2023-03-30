import instanceWithProccessorAuth from "../instances/instanceWithProcessorAuth";

export const getProcessorInfo = () => {
    return instanceWithProccessorAuth({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/GetProcessorInfo',
        method: 'GET',
    })
}

export default getProcessorInfo