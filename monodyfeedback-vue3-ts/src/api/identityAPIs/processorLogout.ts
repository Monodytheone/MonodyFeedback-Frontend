import instanceWithProccessorAuth from "../instances/instanceWithProcessorAuth";

export const processorLogout = () => {
    return instanceWithProccessorAuth({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/Logout',
        method: 'POST',
    })
}

export default processorLogout