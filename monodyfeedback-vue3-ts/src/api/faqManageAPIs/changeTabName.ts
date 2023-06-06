import instanceWithMasterAuthAnd40143Catch from "../instances/instanceWithMasterAuthAnd40143Catch"

export default function getFAQInfoForHomePage(tabId: string, newName: string){
    return instanceWithMasterAuthAnd40143Catch({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: 'api/Manage/ChangeTabName',
        method: 'PUT',
        params: {
            tabId,
            newName,
        }
    })
}