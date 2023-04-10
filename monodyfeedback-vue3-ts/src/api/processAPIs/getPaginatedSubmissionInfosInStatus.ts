import SubmissionStatus from "@/types/SubmissionStatus";
import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch";

export default function getPaginatedSubmissionInfosInStatus(status: SubmissionStatus, page: Number, pageSize: Number) {
    return instanceWithProcessorAuthAnd401403Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: `api/Processor/GetPaginatedSubmissionInfosInStatus/${status}/page/${page}`,
        method: 'GET',
        params: {
            pageSize,
        }
    })
}
