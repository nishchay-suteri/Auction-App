import { APIGatewayProxyEvent } from "aws-lambda";
import { decode } from "jsonwebtoken";

import { JwtPayload } from "./JwtPayload";

export function getJwtToken(event: APIGatewayProxyEvent): string {
    const authorization = event.headers.Authorization;
    const split = authorization.split(" ");
    const jwtToken = split[1];
    return jwtToken;
}

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtPayload;
    return decodedJwt.sub;
}

/**
 * Parse a JWT token and return a user email
 * @param jwtToken JWT token to parse
 * @returns a user email from the JWT token
 */
export function getUserEmail(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtPayload;
    return decodedJwt.email;
}
