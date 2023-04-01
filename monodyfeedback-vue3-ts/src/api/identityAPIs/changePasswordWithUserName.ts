import commonInstance from "../instances/commonInstance"

const changePasswordWithUserName = (userName: string, currentPassword: string, newPassword: string) => {
    return commonInstance({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/ChangeSubmitterPasswordWithUserName',
        method: 'POST',
        data: {
            userName,
            currentPassword,
            newPassword,
        }
    })
}

export default changePasswordWithUserName