import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch";
import PictureInfo from "@/types/PictureInfo";

export default function supplement(submissionId: string, textContent: string, pictureInfos: PictureInfo[]) {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_URL,
        url: 'api/Submitter/Supplement',
        method: "POST",
        data: {
            submissionId,
            textContent,
            pictureInfos,
        },
    })
}
