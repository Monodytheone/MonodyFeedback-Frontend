import commonInstance from '../instances/commonInstance'

export const postLogin = (userName: string, password: string) => {
    return commonInstance({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/Login',
        method: "POST",
        data: {
            userName: userName,
            password: password,
        },
    })
}