import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";

import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

export class AuctionAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly auctionTable = process.env.AUCTION_TABLE
    ) {}

    async createAuction(newItem: AuctionItem): Promise<AuctionItem> {
        console.log("Creating Auction Item ");

        await this.docClient
            .put({
                TableName: this.auctionTable,
                Item: newItem,
            })
            .promise(); // By default, AWS APIs use callbacks.. So, to use async/await, we have to put .promise()

        return newItem;
    }

    async getAuctionById(auctionId: string): Promise<AuctionItem> {
        console.log(`Getting Auction by ID ${auctionId}`);

        const result = await this.docClient
            .get({
                TableName: this.auctionTable,
                Key: {
                    auctionId: auctionId,
                },
            })
            .promise();
        // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined
        /*
        if(!auction){ // 404: not found}
    */
        return result.Item as AuctionItem;
    }

    async getAuctions(): Promise<AuctionItem[]> {
        console.log(`Getting Auctions`);

        const result = await this.docClient
            .scan({ TableName: this.auctionTable })
            .promise();

        const items = result.Items;
        return items as AuctionItem[];
    }

    async updateBid(
        auctionId: string,
        updatedBid: BidItem
    ): Promise<AuctionItem> {
        console.log(`Updating Bid ToDo`);
        const result = await this.docClient
            .update({
                TableName: this.auctionTable,
                Key: {
                    auctionId: auctionId,
                },
                UpdateExpression: "set highestBid.amount = :amount",
                ExpressionAttributeValues: {
                    ":amount": updatedBid.amount,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return result.Attributes as AuctionItem;
    }

    async deleteAuction(auctionId: string) {
        // TODO: Currently, not using it.. Will use in Future
        console.log(`Deleting Auction`);
        const key = {
            auctionId: auctionId,
        };
        await this.docClient
            .delete({ TableName: this.auctionTable, Key: key })
            .promise();
    }
}
