/**
 * A payload of a JWT token
 */
export interface JwtPayload {
    email: string;
    iss: string;
    sub: string;
    iat: number;
    exp: number;
}
