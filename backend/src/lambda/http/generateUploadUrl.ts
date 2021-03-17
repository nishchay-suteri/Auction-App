import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler,
} from "aws-lambda";

import { uploadImage } from "../../businessLogic/auction";

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const auctionId = event.pathParameters.auctionId;

    const url: string = uploadImage(auctionId);

    return {
        statusCode: 200,
        body: JSON.stringify({
            uploadUrl: url,
        }),
    };
};
