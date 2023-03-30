import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch"

export const logout = () => {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/Logout',
        method: 'POST',
    })
}

export default logout