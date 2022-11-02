import { ValidateSignature } from "../../utils";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default async (token: string | JwtPayload) => {
    try {
        const isAuthorized = ValidateSignature(token);
        if (isAuthorized) {
            return isAuthorized;
        }
    } catch (error) {
        return new Error('Not Authorized')
    }

}