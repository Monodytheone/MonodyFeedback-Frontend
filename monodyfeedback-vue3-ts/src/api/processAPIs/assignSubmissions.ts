import instanceWithProcessorAuthAnd401403Catch from "../instances/instanceWithProcessorAuthAnd401403Catch";

export default function assignSubmissions(){
    return instanceWithProcessorAuthAnd401403Catch({
        timeout: 60000,
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_PROCESSOR_URL,
        url: 'api/Processor/AssignSubmissions',
        method: 'POST',
    })
}