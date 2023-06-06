import instanceWithMasterAuthAnd40143Catch from "../instances/instanceWithMasterAuthAnd40143Catch"

export default function createPage(tabId: string, title: string, isPureQandA: Boolean, isHot: Boolean, htmlUrl?: string){
    return instanceWithMasterAuthAnd40143Catch({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: 'api/Manage/createPage',
        method: 'POST',
        data: {
            tabId,
            title,
            isPureQandA,
            isHot,
            htmlUrl: isPureQandA ? null : htmlUrl
        }
    })
}