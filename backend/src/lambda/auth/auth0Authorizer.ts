import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify, decode } from "jsonwebtoken";
import Axios from "axios";
import { Jwt } from "../../utils/auth/Jwt";
import { JwtPayload } from "../../utils/auth/JwtPayload";

import { createLogger } from "../../utils/logger";

const logger = createLogger("lambda-auth-auth0Authorizer");

const jwksUrl = process.env.AUTH0_JWKS_URL;

let cachedCertificate: string;

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    logger.info(
        `Authorizing a user with authorizerToken: ${event.authorizationToken}`
    );
    try {
        const jwtToken: JwtPayload = await verifyToken(
            event.authorizationToken
        );
        logger.info(
            `User was authorized jwtToken - ${JSON.stringify(jwtToken)}`
        );

        return {
            principalId: jwtToken.sub,
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
            principalId: "unathorized-user",
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

async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader);
    const jwt: Jwt = decode(token, { complete: true }) as Jwt;
    logger.info(`Decoded JWT Token: ${JSON.stringify(jwt)}`);
    if (!jwt) {
        logger.error(`Cannot decode JWT Token`);
        throw new Error("Cannot decode JWT Token");
    }

    const certificate = await getCertificate();

    return verify(token, certificate, { algorithms: ["RS256"] }) as JwtPayload;
}

function getToken(authHeader: string): string {
    if (!authHeader) {
        logger.error(`No Authentication Header`);
        throw new Error("No authentication header");
    }

    if (!authHeader.toLowerCase().startsWith("bearer ")) {
        logger.error(`Invalid Authentication Header`);
        throw new Error("Invalid authentication header");
    }

    const split = authHeader.split(" ");
    const token = split[1];

    return token;
}

const getCertificate = async () => {
    if (cachedCertificate) {
        return cachedCertificate;
    }
    const data = await Axios.get(jwksUrl);
    const keys = data.data.keys;
    const signingKeys = keys
        .filter(
            (key) =>
                key.use === "sig" && // JWK property `use` determines the JWK is for signature verification
                key.kty === "RSA" && // We are only supporting RSA (RS256)
                key.kid && // The `kid` must be present to be useful for later
                ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
        )
        .map((key) => {
            return {
                kid: key.kid,
                nbf: key.nbf,
                publicKey: certToPEM(key.x5c[0]),
            };
        });

    if (!signingKeys.length) {
        logger.error(`No SIgning Keys found`);
        throw new Error("No Signing keys found");
    }

    cachedCertificate = signingKeys[0].publicKey;
    return cachedCertificate;
};
function certToPEM(cert: string): string {
    let pem = cert.match(/.{1,64}/g).join("\n");
    pem = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return pem;
}
