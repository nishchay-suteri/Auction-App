import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-auth-auth0Authorizer");

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    logger.info(
        `Authorizing a user with authorizerToken: ${event.authorizationToken}`
    );
    try {
        const jwtToken = await verifyToken(event.authorizationToken);
        logger.info(`User was authorized jwtToken - ${jwtToken}`);

        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "*",
                    },
                ],
            },
        };
    } catch (e) {
        logger.error(`User not authorized - ${e.message} `);

        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Deny",
                        Resource: "*",
                    },
                ],
            },
        };
    }
};

async function verifyToken(authHeader: string) {
    const token = getToken(authHeader);

    if (token !== "123") {
        throw new Error("Token is not 123!!!");
    }
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error("No authentication header");

    if (!authHeader.toLowerCase().startsWith("bearer "))
        throw new Error("Invalid authentication header");

    const split = authHeader.split(" ");
    const token = split[1];

    return token;
}
