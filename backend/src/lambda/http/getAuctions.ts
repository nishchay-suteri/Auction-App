import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getAuctionItems } from "../../businessLogic/auction";

import { createLogger } from "../../utils/logger";

import commonMiddleware from "../../utils/middleware/commonMiddleware";

const logger = createLogger("lambda-http-getAuctions");
import { BadRequest } from "http-errors";

async function getAuctions(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    logger.info(`Processing Event: ${event}`);
    let status: string = event.queryStringParameters.status;

    logger.info(`Passed Qeury parameter - status is ${status}`);

    if (!status) {
        // if status is undefined
        status = "OPEN";
        logger.info(`status changed to OPEN`);
    }

    if (status === "OPEN" || status === "CLOSED") {
        try {
            const auctions = await getAuctionItems(status);
            logger.info("Success");
            return {
                statusCode: 200,
                body: JSON.stringify(auctions),
            };
        } catch (err) {
            logger.error(`Failure: ${err}`);
            throw err;
        }
    } else {
        logger.error(`Failure: Unsupported status passed - ${status}`);
        throw new BadRequest(`Provide a valid status`);
    }
}

export const handler = commonMiddleware(getAuctions);
