import * as AWS from "aws-sdk";
import { AuctionItem } from "../../models/AuctionItem";
import { createLogger } from "../logger";

const sqs = new AWS.SQS();
const logger = createLogger("utils-sqs-SQSHelper");
export async function SendEmailForClosedItem(closedAuctionItem: AuctionItem) {
    logger.info("Send Email For Closed Auction");
    const { title, seller, highestBid } = closedAuctionItem;

    const notifySeller = sqs
        .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                // TODO: Notification Service expects particular structure, so stick to it
                subject: "Your Item has been sold!",
                recipient: seller,
                body: `Wohoo!! Your item ${title} is sold for $${highestBid.amount}`,
            }),
        })
        .promise();

    const notifyBidder = sqs
        .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                // TODO: Notification Service expects particular structure, so stick to it
                subject: "You won an auction!",
                recipient: highestBid.bidder,
                body: `What a great deal! You got yourself a ${title} for $${highestBid.amount}`,
            }),
        })
        .promise();

    return Promise.all([notifyBidder, notifySeller]);
}
