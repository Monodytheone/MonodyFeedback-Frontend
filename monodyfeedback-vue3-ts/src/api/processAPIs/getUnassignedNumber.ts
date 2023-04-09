import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch";

export default function getUnassignedNumber() {
    return instanceWithProcessorAuthAnd401403Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: 'api/Processor/GetUnassignedNumber',
        method: 'GET',
    })
}