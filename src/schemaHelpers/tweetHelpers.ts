import { UserDoc } from "../models/types/userTypes";
import {
	TweetPostThis,
	TweetDoc,
	PopulateTweetRelations,
} from "../models/types/tweetTypes";

export async function populateTweetAfterCreation(this: TweetPostThis) {
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

export const populateTweetRelations: PopulateTweetRelations = function (
	options
) {
	const result = this.populate({
		path: "origin",
		populate: { path: "owner", select: "-email" },
	}).populate({ path: "owner", select: "-email" });

	if (options?.populateLikes) {
		result.populate({ path: "likes", select: "-email" });
	}

	if (options?.populateComments) {
		result.populate({
			path: "comments",
			populate: { path: "creator", select: "-email" },
		});
	}
	if (options?.populateShares) {
		result.populate({
			path: "shares",
			select: ["_id", "origin", "body", "owner", "type"],
		});
	}
	return result;
};
