import * as AWS from "aws-sdk";
import { SQSMessageBodyRequest } from "../requests/SQSMessageBodyRequest";
import { createLogger } from "../utils/logger";

const logger = createLogger("dataAccessLayer-SQSAccess");

export class SQSAccess {
    constructor(
        private readonly sqs: AWS.SQS = new AWS.SQS(),
        private readonly queueURL: string = process.env.MAIL_QUEUE_URL
    ) {}

    async sendMessageToSQS(messageBody: SQSMessageBodyRequest) {
        // Message in our case is Email Content
        logger.info(
            `Sending Message to SQS - Request: ${JSON.stringify(messageBody)}`
        );
        const params: AWS.SQS.SendMessageRequest = {
            QueueUrl: this.queueURL,
            MessageBody: JSON.stringify(messageBody),
        };
        return await this.sqs.sendMessage(params).promise();
    }
}
