import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const auctionTable = process.env.AUCTION_TABLE;

async function getAuction(event, context) {
    let auction;
    const auctionId = event.pathParameters.auctionId;

    const result = await docClient
        .get({ TableName: auctionTable, Key: { auctionId: auctionId } })
        .promise();

    auction = result.Item; // NOTE: It is result.Item, and not result.Items

    // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined
    /*
        if(!auction){ // 404: not found}
    */

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = getAuction;
