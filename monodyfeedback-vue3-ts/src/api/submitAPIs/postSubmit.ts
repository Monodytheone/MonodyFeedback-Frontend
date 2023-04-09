import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch";
import PictureInfo from "@/types/PictureInfo";

export const postSubmit = (telNumber: string | null, email: string | null, textContent: string, pictureInfos: PictureInfo[]) => {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_URL,
        url: 'api/Submitter/Submit',
        method: "POST",
        data: {
            telNumber: telNumber,
            email: email,
            textContent: textContent,
            pictureInfos: pictureInfos,
        },
    })
}

export default postSubmit
