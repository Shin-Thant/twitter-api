import {
	model,
	QueryWithHelpers,
	Schema,
	Types,
	Model,
	HydratedDocument,
} from "mongoose";

//* This is a sample feature. Tweet can now only have text
interface IText {
	text: string;
}
interface IImages {
	images: string[];
}
interface ITextAndPhotos extends IText, IImages {}

export type TweetInfo = IText | IImages | ITextAndPhotos;

export interface ITweet {
	type: "post" | "share";
	body?: string;
	origin?: Types.ObjectId;
	owner?: Types.ObjectId;
	likes?: Types.ObjectId[];
}

interface BasicTweetData<T extends string | Types.ObjectId> {
	owner: T;
	likes?: T[];
}
export interface ICreatedTweet<T extends string | Types.ObjectId>
	extends BasicTweetData<T> {
	type: "post";
	body: string;
	origin?: T;
}
export interface ISharedTweet<T extends string | Types.ObjectId>
	extends BasicTweetData<T> {
	type: "share";
	body?: string;
	origin: T;
}

// TODO: check this works
export type TweetType<T extends string | Types.ObjectId> =
	| ICreatedTweet<T>
	| ISharedTweet<T>;

type TweetDocType = TweetType<Types.ObjectId>;

interface TweetQueryHelpers {
	populateRelations(): QueryWithHelpers<
		HydratedDocument<TweetDocType>[],
		HydratedDocument<TweetDocType>,
		TweetQueryHelpers
	>;
}

type TweetModel = Model<TweetDocType, TweetQueryHelpers>;

const tweetSchema = new Schema<
	TweetDocType,
	TweetModel,
	object,
	TweetQueryHelpers
>(
	{
		type: {
			type: String,
			required: [true, "Tweet type is requried!"],
		},
		body: String,
		origin: {
			type: Schema.Types.ObjectId,
			ref: "Tweet",
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

// TODO: `next` function in `post` middleware
//* populate user in every tweet document creation
tweetSchema.post("save", function () {
	return this.populate({
		path: "owner",
		select: "-email",
	});
});

// TODO: test this works in both `getTweets` and `getTweetById`
tweetSchema.query.populateRelations = function (
	this: QueryWithHelpers<
		any,
		HydratedDocument<TweetDocType>,
		TweetQueryHelpers
	>
) {
	return this.populate({
		path: "origin",
		populate: { path: "owner", select: "-email" },
	})
		.populate({ path: "owner", select: "-email" })
		.populate({ path: "likes", select: "-email" });
};

const Tweet = model<TweetDocType, TweetModel>("Tweet", tweetSchema);
export default Tweet;
