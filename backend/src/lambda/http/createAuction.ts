import * as AWS from "aws-sdk";
import * as uuid from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const auctionTable = process.env.AUCTION_TABLE;

async function createAuction(event) {
    const body = JSON.parse(event.body);
    const timestamp = new Date().toISOString();
    const auctionId = uuid.v4();

    const auction = {
        auctionId: auctionId,
        title: body.title,
        status: "OPEN",
        createdAt: timestamp,
        highestBid: {
            amount: 0,
        },
    };

    await docClient
        .put({
            TableName: auctionTable,
            Item: auction,
        })
        .promise(); // By default, AWS APIs use callbacks.. So, to use async/await, we have to put .promise()

    return {
        statusCode: 201, // Resource created
        body: JSON.stringify({ auction }),
    };
}

export const handler = createAuction;
