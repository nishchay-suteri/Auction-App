import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { CreateAuctionRequest } from "../../requests/createAuctionRequest";
import { createAuctionItem } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import commonMiddleware from "../../utils/middleware/commonMiddleware";

import { getJwtToken } from "../../utils/auth/utils";

const logger = createLogger("lambda-http-createAuction");

async function createAuction(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);
    const newAuction: CreateAuctionRequest = JSON.parse(event.body);
    const jwtToken: string = getJwtToken(event);
    try {
        const auction = await createAuctionItem(newAuction, jwtToken);
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
