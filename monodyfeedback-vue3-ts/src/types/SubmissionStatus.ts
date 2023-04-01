export enum SubmissionStatus {
    /** 待分配 */
    toBeAssigned,

    /** 待处理 */
    toBeProcessed,

    /** 待完善（待补充）*/
    toBeSupplemented,

    /** 待评价 */
    toBeEvaluated,

    /** 已关闭 */
    closed,
}
export default SubmissionStatus