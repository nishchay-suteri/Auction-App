import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";

import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { createLogger } from "../utils/logger";
import { PromiseResult } from "aws-sdk/lib/request";

const logger = createLogger("dataAccessLayer-auctionAccess");

export class AuctionAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly auctionTable = process.env.AUCTION_TABLE
    ) {}

    async createAuction(newItem: AuctionItem): Promise<AuctionItem> {
        logger.info("Creating Auction Item");
        try {
            await this.docClient
                .put({
                    TableName: this.auctionTable,
                    Item: newItem,
                })
                .promise(); // By default, AWS APIs use callbacks.. So, to use async/await, we have to put .promise()
            logger.info("Database Insert: Success");
        } catch (err) {
            logger.error(`Database Insert: Failure - ${err}`);
            throw err;
        }
        return newItem;
    }

    async getAuctionById(auctionId: string): Promise<AuctionItem> {
        logger.info(`Getting Auction Item by ID: ${auctionId}`);
        let result: PromiseResult<DocumentClient.GetItemOutput, AWS.AWSError>;
        try {
            result = await this.docClient
                .get({
                    TableName: this.auctionTable,
                    Key: {
                        auctionId: auctionId,
                    },
                })
                .promise();
            logger.info("Database Get Item By ID: Success");
        } catch (err) {
            logger.error(`Database Get Item By ID: Failure - ${err}`);
            throw err;
        }

        // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined
        /*
        if(!auction){ // 404: not found}
    */
        return result.Item as AuctionItem;
    }

    async getAuctions(): Promise<AuctionItem[]> {
        logger.info("Getting All Auction Items");
        let result: PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>;
        try {
            result = await this.docClient
                .scan({ TableName: this.auctionTable })
                .promise();
            logger.info("Database Get All Items: Success");
        } catch (err) {
            logger.error(`Database Get All Items: Failure ${err}`);
            throw err;
        }

        const items = result.Items;
        return items as AuctionItem[];
    }

    async updateBid(
        auctionId: string,
        updatedBid: BidItem
    ): Promise<AuctionItem> {
        logger.info(
            `Updating Bid Item [New Amount: ${updatedBid.amount}] with Auction ID: ${auctionId}`
        );

        let result: PromiseResult<
            DocumentClient.UpdateItemOutput,
            AWS.AWSError
        >;
        try {
            result = await this.docClient
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
            logger.info("Database Update Bid: Success");
        } catch (err) {
            logger.error(`Database Update Bid: Failure - ${err}`);
            throw err;
        }
        return result.Attributes as AuctionItem;
    }

    async deleteAuction(auctionId: string) {
        // TODO: Currently, not using it.. Will use in Future
        logger.info(`Deleting Auction Item with Auction ID: ${auctionId}`);
        const key = {
            auctionId: auctionId,
        };
        try {
            await this.docClient
                .delete({ TableName: this.auctionTable, Key: key })
                .promise();
            logger.info("Database Delete Auction Item: Success");
        } catch (err) {
            logger.error(`Database Delete Auction Item: Failure - ${err}`);
            throw err;
        }
    }
}
