import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import { CreateAuctionRequest } from "../../requests/createAuctionRequest";
import { createAuctionItem } from "../../businessLogic/auction";

async function createAuction(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const newAuction: CreateAuctionRequest = JSON.parse(event.body);

    const auction = await createAuctionItem(newAuction);

    return {
        statusCode: 201, // Resource created
        body: JSON.stringify({ auction }),
    };
}

export const handler: APIGatewayProxyHandler = createAuction;
