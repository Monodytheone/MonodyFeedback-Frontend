import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch"

export default function getEvaluation(submissionId: string) {
    return instanceWithProcessorAuthAnd401403Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: `api/Processor/GetEvaluation`,
        method: 'GET',
        params: {
            submissionId,
        }
    })
}