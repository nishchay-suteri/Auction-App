import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import { getAuctionItemById } from "../../businessLogic/auction";

async function getAuction(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const auctionId = event.pathParameters.auctionId;

    const auction = await getAuctionItemById(auctionId);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler: APIGatewayProxyHandler = getAuction;
