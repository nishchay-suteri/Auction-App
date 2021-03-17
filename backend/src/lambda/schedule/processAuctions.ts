import { createLogger } from "../../utils/logger";
import {
    getEndedAuctionItems,
    closeAuction,
    SendMessageToSQSForClosedItem,
} from "../../businessLogic/auction";
import { AuctionItem } from "../../models/AuctionItem";
import { InternalServerError } from "http-errors";

const logger = createLogger("lambda-schedule-processAuctions");

async function sendMessageForClosedAuctions(auctionsClosed: AuctionItem[]) {
    auctionsClosed.forEach(async (auction: AuctionItem) => {
        try {
            await SendMessageToSQSForClosedItem(auction);
            logger.info(
                `Sending Message to SQS for Closed Auctions Success - Auction: ${JSON.stringify(
                    auction
                )}`
            );
        } catch (err) {
            logger.error(
                `Sending Message to SQS for Closed Auctions Failed - ${err}`
            );
            throw err;
        }
    });
}

async function processAuctions(event: any) {
    logger.info(`Processing Event: ${event}`);
    logger.info("Processing Auction Items for Closing");
    try {
        const auctionsToClose: AuctionItem[] = await getEndedAuctionItems();
        const closedPromises: number = await closeAuction(auctionsToClose);
        await sendMessageForClosedAuctions(auctionsToClose);
        logger.info("Success");
        return { closed: closedPromises };
    } catch (err) {
        logger.error(`Failure - ${err}`);
        throw new InternalServerError(err);
    }
}

export const handler = processAuctions;
