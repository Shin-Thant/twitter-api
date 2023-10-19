import { Schema, model } from "mongoose";
import {
	populateTweetAfterCreation,
	populateTweetRelations,
} from "../schemaHelpers/tweetHelpers";
import { TweetModel, TweetQueryHelpers, TweetSchema } from "./types/tweetTypes";

const tweetSchema = new Schema<
	TweetSchema,
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
		images: {
			type: [String],
			default: [],
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		shares: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tweet",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// virtuals
tweetSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "tweet",
});

// middlewares
// TODO: change this middleware into method
// tweetSchema.post("save", populateTweetAfterCreation);

// query helpers
tweetSchema.query.populateRelations = populateTweetRelations;

const Tweet = model<TweetSchema, TweetModel>("Tweet", tweetSchema);
export default Tweet;
