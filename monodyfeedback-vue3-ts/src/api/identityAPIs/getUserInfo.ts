import instanceWithAuthorization from "../instances/instanceWithAuthorization";

export const getUserInfo = () => {
    return instanceWithAuthorization({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/GetUserInfo',
        method: 'GET',
    })
}