import DateTime from "xdatetime";
import SubmissionStatus from "@/types/SubmissionStatus";

class SubmissionInfo {
    Id: string;
    Describe: string;
    LastInteractionTime: DateTime;
    Status: SubmissionStatus;

    constructor(id: string, describe: string, lastInteractionTime: DateTime, status: SubmissionStatus) {
        this.Id = id;
        this.Describe = describe;
        this.LastInteractionTime = lastInteractionTime;
        this.Status = status
    }
}

export default SubmissionInfo