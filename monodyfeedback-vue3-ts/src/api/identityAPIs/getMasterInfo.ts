import instanceWithMasterAuth from "../instances/instanceWithMasterAuth";

export const getMasterInfo = () => {
    return instanceWithMasterAuth({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/GetMasterInfo',
        method: 'GET',
    })
}

export default getMasterInfo;