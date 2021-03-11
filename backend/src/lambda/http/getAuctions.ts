import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const auctionTable = process.env.AUCTION_TABLE;

async function getAuctions(event) {
    console.log(`Processing event: ${event} `);
    let auctions;
    const result = await docClient.scan({ TableName: auctionTable }).promise();

    auctions = result.Items;

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = getAuctions;
