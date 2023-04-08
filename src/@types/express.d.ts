/* eslint-disable no-mixed-spaces-and-tabs */
import { Request } from "express";
import { Document, Types, Schema, ObjectId } from "mongoose";
import { IUser } from "../models/User";
import {
	ICreatedTweet,
	ISharedTweet,
	ITweet,
	TweetQueryHelpers,
} from "../models/types/tweetTypes";

type UserDoc =
	| Document<unknown, object, IUser> &
			Omit<
				IUser & {
					_id: Types.ObjectId;
				},
				never
			>;

type TweetDoc =
	| Document<unknown, TweetQueryHelpers, ITweet> &
			Omit<
				| (ICreatedTweet & {
						_id: Types.ObjectId;
				  })
				| (ISharedTweet & {
						_id: Types.ObjectId;
				  }),
				never
			>;

declare module "express" {
	interface Request {
		user?: UserDoc;
		tweet?: TweetDoc;
	}
}
