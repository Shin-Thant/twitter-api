import { CallbackWithoutResultAndOptionalError } from "mongoose";
import { PostQueryThis, QueryThis } from "../models/types/tweetTypes";

export async function populateTweetAfterCreation(doc: PostQueryThis) {
	await doc.populate({
		path: "origin",
		populate: { path: "owner", select: "-email" },
	});
	await doc.populate({ path: "owner", select: "-email" });
	await doc.populate({ path: "likes", select: "-email" });
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
		.populate({ path: "likes", select: "-email" });
}
