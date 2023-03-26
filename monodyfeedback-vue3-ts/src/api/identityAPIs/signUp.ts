import commonInstance from '../instances/commonInstance'

export const signUp = (userName: string, password: string) => {
    return commonInstance({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/SignUp',
        method: "POST",
        data: {
            userName: userName,
            password: password,
        },
    })
}

export default signUp