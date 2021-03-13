import { createLogger } from "../../utils/logger";
import { processAuctionItems } from "../../businessLogic/auction";

const logger = createLogger("lambda-schedule-processAuctions");

async function processAuctions(event: any) {
    logger.info(`Processing Event: ${event}`);
    return await processAuctionItems();
}

export const handler = processAuctions;
