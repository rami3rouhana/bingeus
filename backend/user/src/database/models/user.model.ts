import mongoose, { ObjectId } from "mongoose";
import bcrypt from 'bcrypt';

export interface UserInput {
    email: string;
    name: string;
    password: string;
    salt: string;
    image?: string;
    blockedList?: [{
        userId: ObjectId,
        name: string,
        image: string
    }]
}

export interface userBlock {
    _id: ObjectId;
    blockedList: [{
        userId: ObjectId,
        name: string,
        image: string
    }]
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String },
        image: { type: String },
        blockedList: [{
            userId: { type: String },
            name: { type: String },
            image: { type: String },
        }]
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
            }
        },
        timestamps: true
    }
);


userSchema.pre("save", async function (next) {
    let user = this as unknown as UserDocument;

    if (!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt();

    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;

    user.salt = salt;

    return next();
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
