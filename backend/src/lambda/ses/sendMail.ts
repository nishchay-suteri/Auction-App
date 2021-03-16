import * as AWS from "aws-sdk";

import { createLogger } from "../../utils/logger";

// SES - Amazon Simple Email Service

const ses = new AWS.SES({ region: "us-east-1" });

const logger = createLogger("lambda-ses-sendMail");

async function sendMail(event): Promise<AWS.SES.SendEmailResponse> {
    // TODO: Type of event
    logger.info(`Processing Event: ${event}`);

    const params: AWS.SES.SendEmailRequest = {
        Source: "nishchay.dev@gmail.com", // The Email Address Verified in SES Console
        Destination: { ToAddresses: ["nishchay271095@gmail.com"] },
        Message: {
            Body: { Text: { Data: "Hello There from Nishchay" } },
            Subject: { Data: "Test Mail" },
        },
    };
    try {
        const result: AWS.SES.SendEmailResponse = await ses
            .sendEmail(params)
            .promise();
        logger.info(
            `Send Email - Success : Result - ${JSON.stringify(result)}`
        );
        return result;
    } catch (err) {
        logger.error(`Send Email - Failure : Error - ${err}`);
    }
}

export const handler = sendMail;
