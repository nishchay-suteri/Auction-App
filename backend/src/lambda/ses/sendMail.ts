import * as AWS from "aws-sdk";
import { SQSEvent, SQSRecord } from "aws-lambda";
import { createLogger } from "../../utils/logger";

// SES - Amazon Simple Email Service

const ses = new AWS.SES({ region: "us-east-1" });

const logger = createLogger("lambda-ses-sendMail");

async function sendMail(event: SQSEvent): Promise<AWS.SES.SendEmailResponse> {
    logger.info(`Processing Event: ${event}`);

    // Handle requests coming from SQS
    const record: SQSRecord = event.Records[0]; // Single and only response we are going to process - batchSize is 1
    logger.info(`Record received from SQS: ${JSON.stringify(record)}`);

    const email = JSON.parse(record.body);

    const { subject, body, recipient } = email;

    const params: AWS.SES.SendEmailRequest = {
        Source: "nishchay.dev@gmail.com", // The Email Address Verified in SES Console
        Destination: { ToAddresses: [recipient] },
        Message: {
            Body: { Text: { Data: body } },
            Subject: { Data: subject },
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
