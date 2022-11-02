import { Channel } from 'amqplib';
import { DocumentDefinition } from 'mongoose';
import config from 'config';
import PollModel, { PollDocument } from '../database/models/poll.model';
import { PublishMessage } from "../utils";


export const createPoll = async (input: DocumentDefinition<Omit<PollDocument, 'createdAt' | 'updatedAt' | 'usersId'>>, channel?: Channel) => {
    try {
        const poll = await PollModel.create(input);
        const payload = {
            event: "ADD_POLL",
            payloads: poll
        }
        PublishMessage(channel, config.get<string>('THEATER_SERVICE'), JSON.stringify(payload));
        return { message: "Poll Created" };
    } catch (e) {
        throw new Error(e);
    }
}

export const removePoll = async (_id: string) => {
    try {
        const deletes = await PollModel.deleteOne({ _id });
        if (deletes.deletedCount > 0)
            return { message: "Poll Deleted" };
        else
            return { message: "Poll Doesn't Exist" };
    } catch (e) {
        throw new Error(e);
    }
}

export const addVote = async (_id: string, voting: string, userId: string) => {

    let exists = false;
    const polls = await PollModel.findById(_id);
    polls?.options.map(option => {
        if (option.usersId && option._id) {
            if (option._id.toString() === voting) {
                if (option.usersId.includes(userId)) {
                    exists = true;
                }
                else {
                    option.usersId.push(userId);
                }
            } else {

                if (option.usersId.includes(userId)) {
                    option.usersId.pull(userId);
                }
            }
        }
    })
    await polls?.save();
    return exists;

}