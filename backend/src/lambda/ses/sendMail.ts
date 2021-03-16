import { createLogger } from "../../utils/logger";

// SES - Amazon Simple Email Service

const logger = createLogger("lambda-ses-sendMail");

async function sendMail(event) {
    logger.info(`Processing Event: ${event}`);
    // TODO: Type of event
    return event;
}

export const handler = sendMail;
