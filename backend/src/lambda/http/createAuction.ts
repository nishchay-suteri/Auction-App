import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { CreateAuctionRequest } from "../../requests/createAuctionRequest";
import { createAuctionItem } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import commonMiddleware from "../../utils/middleware/commonMiddleware";

const logger = createLogger("lambda-http-createAuction");

async function createAuction(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);
    const newAuction: CreateAuctionRequest = JSON.parse(event.body);
    try {
        const auction = await createAuctionItem(newAuction);
        logger.info("Success");
        return {
            statusCode: 201, // Resource created
            body: JSON.stringify({ auction }),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        // No Need to create the response in case of error, httpErrorHandler() middleware will do that for us
        throw err;
    }
}

export const handler = commonMiddleware(createAuction);
