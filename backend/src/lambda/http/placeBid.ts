import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PlaceBidRequest } from "../../requests/placeBidRequest";
import { updateBidItem } from "../../businessLogic/auction";

import { getJwtToken } from "../../utils/auth/utils";

import { createLogger } from "../../utils/logger";
const logger = createLogger("lambda-http-getAuctions");

import commonMiddleware from "../../utils/middleware/commonMiddleware";

async function placeBid(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);

    const auctionId = event.pathParameters.auctionId;
    const bid: PlaceBidRequest = JSON.parse(event.body);
    const jwtToken: string = getJwtToken(event);

    try {
        const updatedAuction = await updateBidItem(bid, auctionId, jwtToken);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        };
    } catch (err) {
        logger.error(`Failure: ${err}`);
        throw err;
    }
}

export const handler = commonMiddleware(placeBid);
