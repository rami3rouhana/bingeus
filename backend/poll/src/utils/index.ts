import jwt from "jsonwebtoken";
import config from "config";
import { Request } from "express";


interface userCredentials {
  _id: string;
  email: string;
}


//Utility functions

export const GenerateSignature = (payload: object) => {
  return jwt.sign(payload, config.get<string>('APP_SECRET'), { expiresIn: "1d" });
}
export const ValidateSignature = (req: Request) => {

  const signature = req?.get("Authorization");

  if (signature) {
    const payload = jwt.verify(signature.split(" ")[1], config.get<string>('APP_SECRET'));
    req.user = payload as userCredentials;
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