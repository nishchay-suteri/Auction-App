import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";
import { PlaceBidRequest } from "../../requests/placeBidRequest";
import { updateBidItem } from "../../businessLogic/auction";
import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-http-getAuctions");

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
        return {
            statusCode: 400, // Resource created
            body: JSON.stringify({ error: err }),
        };
    }
}

export const handler: APIGatewayProxyHandler = placeBid;
