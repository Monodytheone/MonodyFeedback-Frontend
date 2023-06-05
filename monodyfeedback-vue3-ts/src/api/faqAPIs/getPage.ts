import commonInstance from "../instances/commonInstance";

export default function getPage(id: string){
    return commonInstance({
        baseURL: process.env.VUE_APP_FAQ_SERVICE_URL,
        url: `api/Access/GetPage/${id}`,
        method: 'GET',
    })
}