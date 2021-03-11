import * as AWS from "aws-sdk";
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

const docClient = new AWS.DynamoDB.DocumentClient();
const auctionTable = process.env.AUCTION_TABLE;

async function getAuctions(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    console.log(`Processing event: ${event} `);
    let auctions;
    const result = await docClient.scan({ TableName: auctionTable }).promise();

    auctions = result.Items;

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler: APIGatewayProxyHandler = getAuctions;
