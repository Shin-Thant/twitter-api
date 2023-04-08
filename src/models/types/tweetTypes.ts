/* eslint-disable no-mixed-spaces-and-tabs */
import {
	PopulatedDoc,
	Document,
	QueryWithHelpers,
	HydratedDocument,
	Model,
	Schema,
	FlatRecord,
} from "mongoose";
import { IUser } from "../User";

//* ObjectId type or Populated document type
type UserRef = PopulatedDoc<Document<Schema.Types.ObjectId> & IUser>;
type TweetRef = PopulatedDoc<Document<Schema.Types.ObjectId> & ITweet>;

// tweet data
interface IBasicTweetData {
	owner: UserRef;
	likes?: UserRef[];
}
export interface ICreatedTweet extends IBasicTweetData {
	type: "post";
	body: string;
	origin?: TweetRef;
}
export interface ISharedTweet extends IBasicTweetData {
	type: "share";
	body?: string;
	origin: TweetRef;
}

export type ITweet = ICreatedTweet | ISharedTweet;

// query helper functions
export interface TweetQueryHelpers {
	populateRelations(): QueryWithHelpers<
		HydratedDocument<ITweet>[],
		HydratedDocument<ITweet>,
		TweetQueryHelpers
	>;
}

export type QueryThis = QueryWithHelpers<
	any,
	HydratedDocument<ITweet>,
	TweetQueryHelpers
>;

export type PostQueryThis = Document<unknown, object, FlatRecord<ITweet>> &
	Omit<
		| (FlatRecord<ICreatedTweet> & {
				_id: Schema.Types.ObjectId;
		  })
		| (FlatRecord<ISharedTweet> & {
				_id: Schema.Types.ObjectId;
		  }),
		never
	> &
	object;

// model
export type TweetModel = Model<ITweet, TweetQueryHelpers>;
