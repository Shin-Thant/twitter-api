import { Schema, model } from "mongoose";
import { ITweet, TweetModel, TweetQueryHelpers } from "./types/tweetTypes";
import {
	populateTweetRelations,
	preFindTweet,
	populateTweetAfterCreation,
} from "../schemaMiddlewares/tweetMiddlewares";

const tweetSchema = new Schema<ITweet, TweetModel, object, TweetQueryHelpers>(
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

tweetSchema.post("save", populateTweetAfterCreation);

tweetSchema.pre("findOne", preFindTweet);
tweetSchema.pre("find", preFindTweet);

tweetSchema.query.populateRelations = populateTweetRelations;

const Tweet = model<ITweet, TweetModel>("Tweet", tweetSchema);
export default Tweet;
