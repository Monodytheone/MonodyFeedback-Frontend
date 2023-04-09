import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch";

export default function getSubmission(submissionId: string) {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_URL,
        url: `api/Submitter/GetSubmission/${submissionId}`,
        method: 'GET',
    })
}