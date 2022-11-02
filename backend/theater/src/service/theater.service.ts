import mongoose, { DocumentDefinition, Types } from 'mongoose';
import config from 'config';
import TheaterModel, { TheaterDocument, userBlock, theaterVote } from '../database/models/theater.model';
import { GenerateSignature, CreateChannel, SubscribeMessage, PublishMessage } from "../utils";

export const createTheater = async (input: DocumentDefinition<Omit<TheaterDocument, 'createdAt' | 'updatedAt' | 'chatRoom' | 'polls' | 'playlist' | 'blockedList'>>) => {
    try {
        return await TheaterModel.create(input);
    } catch (e) {
        throw new Error(e);
    }
}

export const editTheater = async (input: DocumentDefinition<Omit<TheaterDocument, 'createdAt' | 'updatedAt' | 'chatRoom' | 'polls' | 'playlist' | 'blockedList' | 'adminId'>>, _id: string, adminId: string) => {
    try {
        const theater = await TheaterModel.findOne({ _id });
        if (theater && theater.adminId === adminId) {
            if (input.showing) {
                !input.showing.title ?
                    input.showing.title = theater?.showing.title : false;
                !input.showing.poster ?
                    input.showing.poster = theater?.showing.poster : false;
                !input.showing.description ?
                    input.showing.description = theater?.showing.description : false;
                await theater?.update({ showing: input.showing });
            }
            input.name ? await theater?.update(input) : false;
            return { message: "Succesfully upadated" };
        }
        return { message: "This theater is not for this user." };
    } catch (e) {
        throw new Error(e);
    }
}

export const getTheater = async (adminId: string) => {
    try {
        return await TheaterModel.find({ adminId });
    } catch (e) {
        throw new Error(e);
    }
}

export const getUserTheaters = async (theaterId: string, channel: any) => {
    try {
        const theater = await TheaterModel.findById(theaterId);
        const payload = { payloads: theater, event: "RECEIVE_THEATER" };
        PublishMessage(channel, config.get<string>('SOCKET_SERVICE'), JSON.stringify(payload));
        return theater;
    } catch (e) {
        throw new Error(e);
    }
}

export const getAllTheaters = async () => {
    try {
        return await TheaterModel.find();
    } catch (e) {
        throw new Error(e);
    }
}

export const toogleBlock = async (_id: string, blockedUser: { userId: string, name: string, image: string }): Promise<object | undefined> => {
    try {
        const theaters = await TheaterModel.find({ adminId: _id });

        if (theaters.length < 0)
            return { message: "Theaters unavailable" };

        let exist = false;
        if (theaters) {
            theaters.map(async theater => {
                const removeUser = theater?.blockedList as unknown as Types.DocumentArray<userBlock>
                theater.blockedList.map(user => {
                    if (user.userId === blockedUser.userId) {
                        exist = true;
                        removeUser.pull({ userId: user.userId });
                    }
                });
                if (exist) {
                    await theater.save();
                    return { message: "User Unblocked" };
                } else {
                    theater.blockedList.push(blockedUser);
                    await theater.save();
                    return { message: "User Blocked" };
                }
            })
        }
    } catch (e) {
        throw new Error(e);
    }
}

export const insertMedia = async (_id: string, media: { name: string, video: string, description: string }) => {

    const theater = await TheaterModel.findById(_id);

    if (!theater)
        return { message: "Theater unavailable" };

    theater.playlist.push(media);
    await theater.save();
    return { message: "Media Inserted" }
}

export const removeMedia = async (_id: string, mediaId: string) => {

    const theater = await TheaterModel.findById(_id);
    if (!theater)
        return { message: "Theater unavailable" };
    const length = theater.playlist.length
    const remove = theater.playlist as any // temp 
    remove.pull({ _id: mediaId });
    if (length === remove.length)
        return { message: "Invalid Id" }
    await theater?.save();
    return { message: "Media deleted" };

}

export const getPlaylist = async (_id: string) => {

    const theater = await TheaterModel.findById(_id);

    if (!theater)
        return { message: "Theater unavailable" };

    return theater.playlist;
}

export const arrangePlaylist = async (_id: string, fromId: string, toId: string) => {

    const theater = await TheaterModel.findById(_id);

    if (!theater)
        return { message: "Theater unavailable" };
    let before = true
    const obj = {}
    theater.playlist.map((media, index) => {
        if (media._id?.toString() === fromId) {
            obj['from'] = index
        }
        if (media._id?.toString() === toId) {
            obj['to'] = index
        }
    })

    theater.playlist.splice(obj['to'], 0, theater.playlist.splice(obj['from'], 1)[0]);

    await theater?.save();

    return { message: "Playlist rearranged" };
}