import commonInstance from "../instances/commonInstance"

export const checkUserNameUsability = (userName: string) => {
    return commonInstance({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/CheckUserNameUsability',
        method: 'GET',
        params: {
            userName: userName,
        }
    })
}

export default checkUserNameUsability