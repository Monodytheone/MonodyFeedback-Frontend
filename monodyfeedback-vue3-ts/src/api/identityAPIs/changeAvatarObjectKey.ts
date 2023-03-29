import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch"

export const changeAvatarObjectKey = (newObjectKey: string) => {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_IDENTITY_SERVICE_URL,
        url: 'api/Identity/ChangeAvatarObjectKey',
        method: 'PUT',
        params: {
            newObjectKey: newObjectKey,
        }
    })
}

export default changeAvatarObjectKey