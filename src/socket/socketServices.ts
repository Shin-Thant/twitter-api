import { Types } from "mongoose";
import { AppSocket } from ".";
import User from "../models/User";

export async function joinFollowedUsersRooms(
	userId: string,
	socket: AppSocket
) {
	const user = await User.findById({ _id: userId }).lean().exec();
	if (!user) return;

	await Promise.all(
		user.following.map(async (followedUser) => {
			const followedUserRoom = (
				followedUser as unknown as Types.ObjectId
			).toString();

			socket.join(followedUserRoom);
			// socketLogger.info(`User joined to ${followedUserRoom} room.`);
		})
	);
}
