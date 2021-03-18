import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { uploadImage } from "../../businessLogic/auction";
import { UploadImageResponse } from "../../response/uploadImageResponse";
import commonMiddleware from "../../utils/middleware/commonMiddleware";
import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-http-generateUploadUrl");

async function generateUploadUrl(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);
    const auctionId = event.pathParameters.auctionId;
    try {
        const updatedItem: UploadImageResponse = await uploadImage(auctionId);
        logger.info("Success");
        return {
            statusCode: 200,
            body: JSON.stringify({
                updatedItem,
            }),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        // No Need to create the response in case of error, httpErrorHandler() middleware will do that for us
        throw err;
    }
}

export const handler = commonMiddleware(generateUploadUrl);
