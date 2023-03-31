import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch";

export default function getSubmissionInfosOfSubmitter() {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_URL,
        url: 'api/Submitter/GetSubmissionInfosOfSubmitter',
        method: 'GET',
    })
}