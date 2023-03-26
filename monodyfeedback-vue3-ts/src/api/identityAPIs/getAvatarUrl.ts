import instanceWithAuthorization from "../instances/instanceWithAuthorization";

export const getAvatarUrl = () => {
    return instanceWithAuthorization({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/GetPreSignatureAvatarUrl',
        method: 'GET',
    })
}