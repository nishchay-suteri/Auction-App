/**
 * Fields in a request for SQS Message Body.
 */
export interface SQSMessageBodyRequest {
    subject: string;
    recipient: string;
    body: string;
}
