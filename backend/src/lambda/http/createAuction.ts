import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import { CreateAuctionRequest } from "../../requests/createAuctionRequest";
import { createAuctionItem } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

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
        return {
            statusCode: 400, // Resource created
            body: JSON.stringify({ error: err }),
        };
    }
}

export const handler: APIGatewayProxyHandler = createAuction;
