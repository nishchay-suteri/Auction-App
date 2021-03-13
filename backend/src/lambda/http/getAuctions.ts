import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getAuctionItems } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

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
        throw err;
    }
}

export const handler = middy(getAuctions)
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
