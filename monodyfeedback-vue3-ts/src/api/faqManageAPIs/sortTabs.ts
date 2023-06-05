import instanceWithMasterAuthAnd40143Catch from "../instances/instanceWithMasterAuthAnd40143Catch"

export default function SortTabs(sortedTabIds: string[]){
    return instanceWithMasterAuthAnd40143Catch({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: 'api/Manage/SortTabs',
        method: 'POST',
        data: {
            sortedTabIds,
        }
    })
}