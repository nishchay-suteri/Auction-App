import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";
import { PlaceBidRequest } from "../../requests/placeBidRequest";
import { updateBidItem } from "../../businessLogic/auction";

async function placeBid(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const auctionId = event.pathParameters.auctionId;
    const bid: PlaceBidRequest = JSON.parse(event.body);
    const updatedAuction = await updateBidItem(bid, auctionId);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler: APIGatewayProxyHandler = placeBid;
