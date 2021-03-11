import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const auctionTable = process.env.AUCTION_TABLE;

async function placeBid(event, context) {
    const auctionId = event.pathParameters.auctionId;
    const bid = JSON.parse(event.body);
    let updatedAuction;

    // TODO: Check if auction Id Exists or not

    const result = await docClient
        .update({
            TableName: auctionTable,
            Key: {
                auctionId: auctionId,
            },
            UpdateExpression: "set highestBid.amount = :amount",
            ExpressionAttributeValues: {
                ":amount": bid.amount,
            },
            ReturnValues: "ALL_NEW",
        })
        .promise();

    updatedAuction = result.Attributes;

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = placeBid;
