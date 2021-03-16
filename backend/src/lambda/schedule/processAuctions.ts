import { createLogger } from "../../utils/logger";
import {
    getEndedAuctionItems,
    closeAuction,
} from "../../businessLogic/auction";
import { AuctionItem } from "../../models/AuctionItem";
import { InternalServerError } from "http-errors";

const logger = createLogger("lambda-schedule-processAuctions");

async function processAuctions(event: any) {
    logger.info(`Processing Event: ${event}`);
    logger.info("Processing Auction Items for Closing");
    try {
        const auctionsToClose: AuctionItem[] = await getEndedAuctionItems();
        const closedPromises: number = await closeAuction(auctionsToClose);
        logger.info("Success");
        return { closed: closedPromises };
    } catch (err) {
        logger.error(`Failure - ${err}`);
        throw new InternalServerError(err);
    }
}

export const handler = processAuctions;
