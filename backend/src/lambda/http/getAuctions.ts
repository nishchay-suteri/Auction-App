import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";
import { getAuctionItems } from "../../businessLogic/auction";

async function getAuctions(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    console.log(`Processing event: ${event} `);
    const auctions = await getAuctionItems();

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler: APIGatewayProxyHandler = getAuctions;
