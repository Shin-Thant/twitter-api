import { Request } from "express";
import { Document, Types } from "mongoose";
import { IUser } from "../models/User";

declare module "express" {
	interface Request {
		user?: Document<unknown, object, IUser> &
			Omit<
				IUser & {
					_id: Types.ObjectId;
				},
				never
			>;
	}
}
