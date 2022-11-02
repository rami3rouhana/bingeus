import { ValidateSignature } from "../../utils";
import { Request, Response, NextFunction } from "express";

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isAuthorized = ValidateSignature(req);

        if (isAuthorized) {
            return next();
        }
    } catch (error) {
        return res?.status(403).json({ message: 'Not Authorized' })
    }


}