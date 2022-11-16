import mongoose, { ObjectId } from "mongoose";

export interface UserInput {
    adminId: string,
    name: string,
    showing: {
        _id?: string,
        name: string,
        url: string,
        duration: string,
        image: string,
        description: string,
    },
    polls: [{
        pollId?: string,
        title: string,
        options: [{
            optionId: string,
            name: string,
            votes: number
        }]
    }],
    playlist: [{
        _id?: string,
        name: string,
        url: string,
        current: boolean,
        duration: string,
        image: string,
        description: string,
    }],
    blockedList: [string]
}


export interface TheaterDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface theaterVote {
    _id?: string,
    title: string,
    options: [{
        _id?: string,
        name: string,
        votes?: string[]
    }],
}

const theaterSchema = new mongoose.Schema(
    {
        adminId: { type: String },
        name: { type: String, required: true },
        showing: {
            name: { type: String },
            duration: { type: String },
            url: { type: String },
            image: { type: String },
            description: { type: String },
        },
        playlist: [{
            name: { type: String },
            url: { type: String },
            image: { type: String },
            duration: { type: String },
            current: { type: Boolean, default: false },
            description: { type: String },
        }],
        blockedList: [{ type: String }]
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

const TheaterModel = mongoose.model<TheaterDocument>("theater", theaterSchema);

export default TheaterModel;
