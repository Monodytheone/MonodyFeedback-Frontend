import instanceWithMasterAuth from "../instances/instanceWithMasterAuth";

export const masterLogout = () => {
    return instanceWithMasterAuth({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/Logout',
        method: 'POST',
    })
}

export default masterLogout;