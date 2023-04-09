import SubmissionStatus from "@/types/SubmissionStatus";
import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch";
import PictureInfo from "@/types/PictureInfo";

export default function postProcess(submissionId: string, nextStatus: SubmissionStatus, textContent: string, pictureInfos: PictureInfo[]) {
    return instanceWithProcessorAuthAnd401403Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: `api/Processor/Process`,
        method: 'POST',
        data: {
            submissionId,
            nextStatus,
            textContent,
            pictureInfos,
        }
    })
}