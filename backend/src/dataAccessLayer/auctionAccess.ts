import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";

import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { createLogger } from "../utils/logger";

import { InternalServerError } from "http-errors";
import { SendEmailForClosedItem } from "../utils/sqs/SQSHelper";

const logger = createLogger("dataAccessLayer-auctionAccess");

export class AuctionAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly auctionTable = process.env.AUCTION_TABLE,
        private readonly statusAndEndDateIndex = process.env
            .AUCTION_STATUS_END_DATE_INDEX
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
            return newItem;
        } catch (err) {
            logger.error(`Database Insert: Failure - ${err}`);
            throw new InternalServerError(err);
        }
    }

    async getAuctionById(auctionId: string): Promise<AuctionItem> {
        logger.info(`Getting Auction Item by ID: ${auctionId}`);
        try {
            const result = await this.docClient
                .get({
                    TableName: this.auctionTable,
                    Key: {
                        auctionId: auctionId,
                    },
                })
                .promise();
            logger.info("Database Get Item By ID: Success");
            return result.Item as AuctionItem;
        } catch (err) {
            logger.error(`Database Get Item By ID: Failure - ${err}`);
            throw new InternalServerError(err);
        }
    }

    async getAuctions(status: string): Promise<AuctionItem[]> {
        logger.info(`Getting All Auction Items with status ${status}`);
        try {
            const result = await this.docClient
                .query({
                    TableName: this.auctionTable,
                    IndexName: this.statusAndEndDateIndex,
                    KeyConditionExpression: "#status = :status",
                    ExpressionAttributeNames: {
                        "#status": "status",
                    },
                    ExpressionAttributeValues: {
                        ":status": status,
                    },
                })
                .promise();
            logger.info("Database Get All Items: Success");
            const items = result.Items;
            return items as AuctionItem[];
        } catch (err) {
            logger.error(`Database Get All Items: Failure ${err}`);
            // NOTE: for development purpose, we are sending err..
            throw new InternalServerError(err);
        }
    }

    async updateBid(
        auctionId: string,
        updatedBid: BidItem
    ): Promise<AuctionItem> {
        logger.info(
            `Updating Bid Item [New Amount: ${updatedBid.amount}] with Auction ID: ${auctionId}`
        );

        try {
            const result = await this.docClient
                .update({
                    TableName: this.auctionTable,
                    Key: {
                        auctionId: auctionId,
                    },
                    UpdateExpression:
                        "set highestBid.amount = :amount , highestBid.bidder = :bidder",
                    ExpressionAttributeValues: {
                        ":amount": updatedBid.amount,
                        ":bidder": updatedBid.bidder,
                    },
                    ReturnValues: "ALL_NEW",
                })
                .promise();
            logger.info("Database Update Bid: Success");
            return result.Attributes as AuctionItem;
        } catch (err) {
            logger.error(`Database Update Bid: Failure - ${err}`);
            throw new InternalServerError(err);
        }
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
            throw new InternalServerError(err);
        }
    }

    async getEndedAuctions(now: string): Promise<AuctionItem[]> {
        logger.info(`Getting Ended Auction Items for End Date: ${now}`);
        try {
            const result = await this.docClient
                .query({
                    TableName: this.auctionTable,
                    IndexName: this.statusAndEndDateIndex,
                    KeyConditionExpression:
                        "#status = :status AND endingAt <= :now",
                    ExpressionAttributeNames: {
                        "#status": "status",
                    },
                    ExpressionAttributeValues: {
                        ":status": "OPEN",
                        ":now": now,
                    },
                })
                .promise();
            logger.info("Database Get Ended Auction Items: Success");
            const items = result.Items;
            return items as AuctionItem[];
        } catch (err) {
            logger.error(`Database Get Ended Auction Items: Failure ${err}`);
            // NOTE: for development purpose, we are sending err..
            throw new InternalServerError(err);
        }
    }

    async closeAuction(auctionId: string): Promise<AuctionItem> {
        logger.info(`Closing Auction Item with Auction ID: ${auctionId}`);

        try {
            const result = await this.docClient
                .update({
                    TableName: this.auctionTable,
                    Key: {
                        auctionId: auctionId,
                    },
                    UpdateExpression: "set #status = :status",
                    ExpressionAttributeNames: {
                        "#status": "status",
                    },
                    ExpressionAttributeValues: {
                        ":status": "CLOSED",
                    },
                    ReturnValues: "ALL_NEW",
                })
                .promise();
            logger.info("Database Update Status: Success");
            const item: AuctionItem = result.Attributes as AuctionItem;
            await SendEmailForClosedItem(item);
            return item;
        } catch (err) {
            logger.error(`Database Update Status: Failure - ${err}`);
            throw new InternalServerError(err);
        }
    }
}
