import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";
import { getAuctionItems } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-http-getAuctions");

async function getAuctions(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);

    try {
        const auctions = await getAuctionItems();
        logger.info("Success");
        return {
            statusCode: 200,
            body: JSON.stringify(auctions),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        return {
            statusCode: 400, // Resource created
            body: JSON.stringify({ error: err }),
        };
    }
}

export const handler: APIGatewayProxyHandler = getAuctions;
