import { createLogger } from "../../utils/logger";
import { getEndedAuctionItems } from "../../businessLogic/auction";

const logger = createLogger("lambda-schedule-processAuctions");

async function processAuctions(event: any) {
    logger.info(`Processing Event: ${event}`);
    await getEndedAuctionItems();
}

export const handler = processAuctions;
