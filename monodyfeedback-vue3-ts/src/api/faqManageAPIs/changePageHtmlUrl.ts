import instanceWithMasterAuthAnd40143Catch from "../instances/instanceWithMasterAuthAnd40143Catch"

export default function (pageId: string, newUrl: string){
    return instanceWithMasterAuthAnd40143Catch({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: 'api/Manage/ChangePageHtmlUrl',
        method: 'PUT',
        params: {
            pageId,
            newUrl,
        }
    })
}