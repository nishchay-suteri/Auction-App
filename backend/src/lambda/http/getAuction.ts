import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import { getAuctionItemById } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-http-getAuction");

async function getAuction(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);

    const auctionId = event.pathParameters.auctionId;
    try {
        const auction = await getAuctionItemById(auctionId);
        logger.info("Success");
        return {
            statusCode: 200,
            body: JSON.stringify(auction),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        return {
            statusCode: 400, // Resource created
            body: JSON.stringify({ error: err }),
        };
    }
}

export const handler: APIGatewayProxyHandler = getAuction;
