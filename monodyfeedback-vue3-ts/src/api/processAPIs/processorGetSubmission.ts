import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch";

export default function processorGetSubmission(submissionId: string) {
    return instanceWithProcessorAuthAnd401403Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: `api/Processor/GetSubmission/${submissionId}`,
        method: 'GET',
    })
}