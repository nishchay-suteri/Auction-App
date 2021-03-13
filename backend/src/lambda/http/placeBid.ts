import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PlaceBidRequest } from "../../requests/placeBidRequest";
import { updateBidItem } from "../../businessLogic/auction";
import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-http-getAuctions");

import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

async function placeBid(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);

    const auctionId = event.pathParameters.auctionId;
    const bid: PlaceBidRequest = JSON.parse(event.body);
    try {
        const updatedAuction = await updateBidItem(bid, auctionId);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        throw err;
    }
}

export const handler = middy(placeBid)
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
