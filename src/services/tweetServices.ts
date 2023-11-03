import Tweet from "../models/Tweet";
import { TweetSchema } from "../models/types/tweetTypes";
import {
	DeleteOne,
	FindMany,
	FindOne,
	GetCount,
	LikeOne,
	UpdateOne,
} from "./types";

type TweetContent =
	| { body: string; images?: string[] }
	| { body?: string; images: string[] }
	| { body: string; images: string[] };

export type CreateTweet = {
	type: "post";
	owner: string;
} & TweetContent;

export type ShareTweet = {
	type: "share";
	body?: string;
	owner: string;
	origin: string;
} & TweetContent;

type NewTweet = CreateTweet | ShareTweet;
export async function createTweet(input: NewTweet) {
	return Tweet.create(input);
}

export async function getTweetCount(args: GetCount<TweetSchema>) {
	return Tweet.countDocuments(args.filter, args.options);
}

export async function findTweet(args: FindOne<TweetSchema>) {
	return await Tweet.findOne(
		args.filter,
		args.projection,
		args.options
	).exec();
}

export async function findManyTweets(args: FindMany<TweetSchema>) {
	return await Tweet.find(args.filter, args.projection, args.options);
}

export async function updateTweet(args: UpdateOne<TweetSchema>) {
	return await Tweet.findOneAndUpdate(args.filter, args.update, args.options);
}

export async function handleTweetLikes(args: LikeOne<TweetSchema>) {
	let update: UpdateOne<TweetSchema>["update"];

	if (args.action === "like") {
		update = {
			$push: {
				likes: args.item,
			},
		};
	} else {
		update = {
			$pull: {
				likes: args.item,
			},
		};
	}

	return await updateTweet({
		filter: args.filter,
		update,
		options: args.options,
	});
}

export async function deleteTweet(args: DeleteOne<TweetSchema>) {
	return Tweet.findOneAndDelete(args.filter, args.options);
}
