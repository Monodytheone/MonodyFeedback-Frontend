export default class PictureInfo {
    bucketName: string;
    region: string;
    fullObjectKey: string;

    constructor(bucketName: string, region: string, fullObjectKey: string) {
        this.bucketName = bucketName;
        this.region = region;
        this.fullObjectKey = fullObjectKey;
    }
}