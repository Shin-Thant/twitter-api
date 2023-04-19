import { CallbackWithoutResultAndOptionalError } from "mongoose";
import { PostQueryThis, QueryThis, TweetDoc } from "../models/types/tweetTypes";
import { UserDoc } from "../models/User";

export async function populateTweetAfterCreation(this: PostQueryThis) {
	await this.populate<{ origin: TweetDoc }>({
		path: "origin",
		populate: { path: "owner", select: "-email" },
	});
	await this.populate<{ owner: Omit<UserDoc, "email"> }>({
		path: "owner",
		select: "-email",
	});
	await this.populate<{ likes: Omit<UserDoc, "email"> }>({
		path: "likes",
		select: "-email",
	});
}

export function preFindTweet(
	this: QueryThis,
	next: CallbackWithoutResultAndOptionalError
) {
	this.populateRelations();
	next();
}

export function populateTweetRelations(this: QueryThis) {
	return this.populate({
		path: "origin",
		populate: { path: "owner", select: "-email" },
	})
		.populate({ path: "owner", select: "-email" })
		.populate({ path: "likes", select: "-email" })
		.populate("comments");
}
