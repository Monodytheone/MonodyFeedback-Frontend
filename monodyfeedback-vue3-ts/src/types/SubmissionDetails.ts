import DateTime from "xdatetime";
import SubmissionStatus from "./SubmissionStatus";

export class SubmissionDetials {
    Status: SubmissionStatus;
    Paragraphs: ParagraphDetials[];

    constructor(status: SubmissionStatus, paragraphs: ParagraphDetials[]) {
        this.Status = status;
        this.Paragraphs = paragraphs;
    }
}

export class ParagraphDetials {
    Sequence: number;
    CreationTime: DateTime;
    Sender: string;
    TextContent: string;
    PictureUrls: string[];

    constructor(sequence: number, creationTime: DateTime, sender: string, textContent: string, pictureUrls: string[]) {
        this.Sequence = sequence;
        this.CreationTime = creationTime;
        this.Sender = sender;
        this.TextContent = textContent;
        this.PictureUrls = pictureUrls;
    }
}

export default SubmissionDetials