import { DocumentDefinition, ObjectId, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel, { UserDocument, userBlock } from '../database/models/user.model';
import { ValidatePassword, GenerateSignature } from "../utils";

export const createUser = async (input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'salt'>>) => {
    try {
        return await UserModel.create(input);
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

export const editUser = async (input: editUser, email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        input.email ? await user?.update({ email: input.email }) : false;
        if (input.password) {
            const salt = await bcrypt.genSalt();
            const hash = bcrypt.hashSync(input.password, salt);
            await user?.update({ password: hash, salt: salt });
        }
        input.name ? await user?.update({ name: input.name }) : false;
        input.image ? await user?.update({ image: input.image }) : false;

        return { message: "Succesfully upadated" };
    } catch (e) {
        throw new Error(e)
    }
}

export const getUser = async (_id: string) => {
    try {
        return await UserModel.findOne({ _id });
    } catch (e) {
        throw new Error(e)
    }
}

export const toogleblock = async (_id: string, blockedUser: { userId: ObjectId, name: string, image: string }) => {
    try {
        const user = await UserModel.findById(_id);
        if (user?.blockedList) {
            const removeUser = user?.blockedList as unknown as Types.DocumentArray<userBlock>
            let exist = false;
            user?.blockedList.map(u => {
                if (u.userId === blockedUser.userId && user?.blockedList) {
                    exist = true;
                    removeUser.pull({ userId: u.userId });
                }
            });
            if (exist) {
                await user.save();
                return false
            } else {
                user?.blockedList.push(blockedUser);
                await user.save();
                return true
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

    const token = GenerateSignature({ email: user.email, _id: user._id });

    if (!isValid) throw Error('Wrong Credentinals');

    return token;
}