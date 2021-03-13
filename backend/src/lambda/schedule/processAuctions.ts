import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-schedule-processAuctions");

async function processAuctions(event: any) {
    logger.info(`Processing Event: ${event}`);
}

export const handler = processAuctions;
