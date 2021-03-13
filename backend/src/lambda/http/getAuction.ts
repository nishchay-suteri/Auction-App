import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getAuctionItemById } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

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
        throw err;
    }
}

export const handler = middy(getAuction)
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
