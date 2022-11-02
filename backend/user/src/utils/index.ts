import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import { Request } from "express";
import amqplib, { Channel } from "amqplib";


interface userCredentials {
  _id: string;
  email: string;
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


//Message Broker
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(config.get<string>('MSG_QUEUE_URL'));
    const channel = await connection.createChannel();
    await channel.assertQueue(config.get<string>('EXCHANGE_NAME'), "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (channel: Channel, service, msg) => {
  channel.publish(config.get<string>('EXCHANGE_NAME'), service, Buffer.from(msg), {
    persistent: true
  });
  console.log("Sent: ", msg);
};

export const SubscribeMessage = async (channel: Channel, service) => {

  await channel.assertExchange(config.get<string>('EXCHANGE_NAME'), "direct", { durable: true });
  const q = await channel.assertQueue(config.get<string>('QUEUE_NAME'), "direct", { exclusive: true, durable: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, config.get<string>('EXCHANGE_NAME'), config.get<string>('USER_SERVICE'));

  channel.consume(
    q.queue,
    (msg) => {
      if (msg?.content) {
        channel.ack(msg)
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString(), channel);
      }
      console.log("[X] received");
    }
  )
}