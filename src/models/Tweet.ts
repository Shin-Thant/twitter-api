import { Schema, model } from "mongoose";
import {
	populateTweetAfterCreation,
	populateTweetRelations,
	preFindTweet,
} from "../schemaMiddlewares/tweetMiddlewares";
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
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
tweetSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "tweet",
});

tweetSchema.post("save", populateTweetAfterCreation);

tweetSchema.pre("findOne", preFindTweet);
tweetSchema.pre("find", preFindTweet);

tweetSchema.query.populateRelations = populateTweetRelations;

const Tweet = model<TweetSchema, TweetModel>("Tweet", tweetSchema);
export default Tweet;
