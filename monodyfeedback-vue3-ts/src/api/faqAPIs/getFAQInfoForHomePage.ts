import commonInstance from "../instances/commonInstance";

export default function getFAQInfoForHomePage(){
    return commonInstance({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: 'api/Access/GetFAQInfoForHomePage',
        method: 'GET',
    })
}