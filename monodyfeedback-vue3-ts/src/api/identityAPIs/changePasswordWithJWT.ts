import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch"

export const changePasswordWithJWT = (currentPassword: string, newPassword: string) => {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/ChangeSubmitterPasswordWithJWT',
        method: 'POST',
        data: {
            currentPassword: currentPassword,
            newPassword: newPassword,
        }
    })
}

export default changePasswordWithJWT