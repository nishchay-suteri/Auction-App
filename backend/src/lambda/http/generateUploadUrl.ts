import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import * as AWS from "aws-sdk";

const s3 = new AWS.S3({
    signatureVersion: "v4",
});

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const auctionId = event.pathParameters.auctionId;

    // TODO: Check if auctionID Exists

    const url = getUploadURL(auctionId);
    return {
        statusCode: 200,
        body: JSON.stringify({
            uploadUrl: url,
        }),
    };
};

const getUploadURL = (auctionId: string) => {
    return s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: auctionId,
        Expires: parseInt(urlExpiration),
    });
};
