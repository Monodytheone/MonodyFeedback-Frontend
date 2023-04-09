import instanceWithAuthorizationAnd401Catch from "../instances/instanceWithAuthorizationAnd401Catch";

export default function evaluate(submissionId: string, isSolved: boolean, grade: number) {
    return instanceWithAuthorizationAnd401Catch({
        baseURL: process.env.VUE_APP_SUBMIT_SERVICE_URL,
        url: 'api/Submitter/Evaluate',
        method: "POST",
        data: {
            submissionId,
            isSolved,
            grade,
        },
    })
}
