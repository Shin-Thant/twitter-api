/* eslint-disable no-mixed-spaces-and-tabs */
import { Request } from "express";
import { Document, Types } from "mongoose";
import { IUser } from "../models/User";
import {
	ICreatedTweet,
	ISharedTweet,
	TweetDocType,
	TweetQueryHelpers,
} from "../models/Tweet";

type UserDoc = Document<unknown, object, IUser> &
	Omit<
		IUser & {
			_id: Types.ObjectId;
		},
		never
	>;

type TweetDoc = Document<unknown, TweetQueryHelpers, TweetDocType> &
	Omit<
		| (ICreatedTweet<Schema.Types.ObjectId> & {
				_id: Types.ObjectId;
		  })
		| (ISharedTweet<Schema.Types.ObjectId> & {
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
