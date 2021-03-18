import * as AWS from "aws-sdk";
import { InternalServerError } from "http-errors";

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
        try {
            return this.s3.getSignedUrl("putObject", {
                Bucket: this.bucketName,
                Key: auctionId,
                Expires: parseInt(this.urlExpiration),
            });
        } catch (err) {
            logger.error(`Getting Signed URL - FAILED : ${err}`);
            throw new InternalServerError(err);
        }
    }

    getPublicImageURL(auctionId: string): string {
        const url: string = `https://${this.bucketName}.s3.amazonaws.com/${auctionId}`;
        return url;
    }
}
