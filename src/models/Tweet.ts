import { model, Schema, Types } from "mongoose";

interface TweetType {
	text?: string;
	image?: string;
	user: Types.ObjectId;
	likes: number;
}

const tweetSchema = new Schema<TweetType>({
	text: String,
	image: String,
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	likes: { type: Number, default: 0 },
});

const Tweet = model<TweetType>("Tweet", tweetSchema);
export default Tweet;
