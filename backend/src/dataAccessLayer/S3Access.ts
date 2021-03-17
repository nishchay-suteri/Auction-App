import * as AWS from "aws-sdk";
import { createLogger } from "../utils/logger";

const logger = createLogger("dataAccessLayer-S3Access");

export class S3Access {
    constructor(
        private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: "v4" }),
        private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration: string = process.env
            .SIGNED_URL_EXPIRATION
    ) {}

    getSignedURL(auctionId: string) {
        logger.info(`Getting Signed URL - Auction ID: ${auctionId}`);
        return this.s3.getSignedUrl("putObject", {
            Bucket: this.bucketName,
            Key: auctionId,
            Expires: parseInt(this.urlExpiration),
        });
    }
}
