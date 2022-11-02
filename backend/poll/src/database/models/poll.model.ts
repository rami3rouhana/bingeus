import mongoose, { ObjectId } from "mongoose";

export interface UserInput {
    theaterId: string,
    adminId: string,
    title: string,
    options: [{
        _id?: ObjectId,
        name: string,
        usersId?: any
    }],
}

export interface PollDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const PollSchema = new mongoose.Schema(
    {
        theaterId: { type: String },
        adminId: { type: String },
        title: { type: String },
        options: [{
            name: { type: String },
            usersId: [{ type: String }]
        }],
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        },
        timestamps: true
    }
);


const PollModel = mongoose.model<PollDocument>("poll", PollSchema);

export default PollModel;