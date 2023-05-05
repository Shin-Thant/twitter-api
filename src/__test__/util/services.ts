import mongoose from "mongoose";
import createToken from "../../lib/createToken";
import Comment from "../../models/Comment";
import Tweet from "../../models/Tweet";
import User from "../../models/User";

export async function getRandomComment(query?: object) {
	return await Comment.findOne(query);
}
export async function getRandomUser(query?: object) {
	return await User.findOne(query);
}
export async function getRandomTweet() {
	return await Tweet.findOne();
}

export function createBearerToken(userId: string) {
	const payload = {
		userInfo: { id: userId },
	};
	const token = createToken(payload, "access");
	const bearerToken = `Bearer ${token}` as const;
	return bearerToken;
}

export function createObjectId() {
	return new mongoose.Types.ObjectId().toString();
}
