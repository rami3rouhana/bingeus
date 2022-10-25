import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  jwt: string | JwtPayload
}


//Utility functions
export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: object) => {
  return jwt.sign(payload, config.get<string>('APP_SECRET'), { expiresIn: "1d" });
}
export const ValidateSignature = (req: IGetUserAuthInfoRequest) => {

  const signature = req?.get("Authorization");

  if (signature) {
    const payload = jwt.verify(signature.split(" ")[1], config.get<string>('APP_SECRET'));
    req.jwt = payload;
    return true;
  }

  return false;
};

export const FormateData = (data: object) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
