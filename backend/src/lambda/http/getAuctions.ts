import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getAuctionItems } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import commonMiddleware from "../../utils/middleware/commonMiddleware";

const logger = createLogger("lambda-http-getAuctions");

async function getAuctions(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);
    const status = event.queryStringParameters.status;

    try {
        const auctions = await getAuctionItems(status);
        logger.info("Success");
        return {
            statusCode: 200,
            body: JSON.stringify(auctions),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        throw err;
    }
}

export const handler = commonMiddleware(getAuctions);
