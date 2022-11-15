import { DocumentDefinition, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel, { UserDocument, userBlock } from '../database/models/user.model';
import { ValidatePassword, GenerateSignature, PublishMessage } from "../utils";
import { Channel } from 'amqplib';
import config from 'config';

export const createUser = async (input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'salt'>>) => {
    try {
        const user = await UserModel.create(input);
        const jwt = GenerateSignature({ name: user.name, image: user.image, _id: user._id });
        return { token: jwt, user: { _id: user._id, name: user.name, image: user.image } }
    } catch (e) {
        throw new Error(e)
    }
}

interface editUser {
    email?: string,
    password?: string | Buffer,
    name?: string,
    image?: string
}

export const updateImage = async (_id: string, path: string) => {
    try {
        const user = await UserModel.findById(_id);
        await user?.updateOne({ image: path });
        return { message: "Succesfully upadated", path };
    } catch (e) {
        throw new Error(e)
    }
}

export const editUser = async (input: editUser, _id: string) => {
    try {
        const user = await UserModel.findById(_id);
        if (input.password) {
            const salt = await bcrypt.genSalt();
            const hash = bcrypt.hashSync(input.password, salt);
            await user?.updateOne({ password: hash, salt: salt });
        }
        input.name ? await user?.updateOne({ name: input.name }) : false;
        return { message: "Succesfully upadated" };
    } catch (e) {
        throw new Error(e)
    }
}




export const getUser = async (_id: string) => {
    try {
        const user = await UserModel.findOne({ _id });
        if (!user)
            return { message: "User Not Found" };
        const jwt = GenerateSignature({ name: user.name, image: user.image, _id: user._id });
        return { token: jwt, user: { _id: user._id, name: user.name, image: user.image, email: user.email, blockedList: user.blockedList } };
    } catch (e) {
        throw new Error(e)
    }
}

export const toogleBlock = async (_id?: string, userId?: string, channel?: Channel) => {
    try {
        const user = await UserModel.findById(_id);
        const userBlock = await UserModel.findById(userId);
        if (!userBlock) {
            return { message: "User Doesn't exist" }
        }
        if (user?.blockedList) {
            const removeUser = user?.blockedList as unknown as Types.DocumentArray<userBlock>
            let exist = false;
            user?.blockedList.map(u => {
                if (u.userId.toString() === userId && user?.blockedList) {
                    exist = true;
                    removeUser.pull({ userId: userBlock._id });
                }
            });
            if (exist) {
                await user.save();
                const payload = { event: "UNBLOCK_USER", payloads: { _id, userId } };
                PublishMessage(channel, config.get<string>("THEATER_SERVICE"), JSON.stringify(payload));
                return { message: "User Unblocked" };
            } else {
                removeUser.push({
                    userId: userBlock._id,
                    name: userBlock.name,
                    image: userBlock.image
                })
                await user.save();
                return { message: "User Blocked" };
            }
        } else {

        }
    } catch (e) {
        throw new Error(e)
    }
}

export async function validateUser({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const user = await UserModel.findOne({ email });

    if (!user) throw Error('Wrong Credentinals');

    const isValid = await ValidatePassword(password, user.password, user.salt);

    const token = GenerateSignature({ name: user.name, image: user.image, _id: user._id });

    if (!isValid) throw Error('Wrong Credentinals');

    return { token, user: { _id: user._id, name: user.name, image: user.image } };
}