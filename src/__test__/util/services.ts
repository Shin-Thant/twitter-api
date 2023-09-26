import mongoose, { FilterQuery } from "mongoose";
import Comment from "../../models/Comment";
import Tweet from "../../models/Tweet";
import User from "../../models/User";
import { UserDoc } from "../../models/types/userTypes";
import { CommentDoc } from "../../models/types/commentTypes";
import { createJwtToken, getSecretKeyFor } from "../../util/jwt";

export async function getRandomComment(query?: FilterQuery<CommentDoc>) {
	return await Comment.findOne(query);
}
export async function getRandomUser(query?: FilterQuery<UserDoc>) {
	return await User.findOne(query);
}
export async function getRandomTweet() {
	return await Tweet.findOne();
}

export function createBearerToken(userId: string) {
	const payload = {
		userInfo: { id: userId },
	};
	const token = createJwtToken({
		payload,
		secretKey: getSecretKeyFor("access_token"),
	});
	const bearerToken = `Bearer ${token}` as const;
	return bearerToken;
}

export function createObjectId() {
	return new mongoose.Types.ObjectId().toString();
}
