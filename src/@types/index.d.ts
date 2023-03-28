import { Request } from "express";
import { Document } from "mongoose";
import { IUser } from "../models/User";

declare module "express" {
	interface Request {
		user?: Document<unknown, object, IUser>;
	}
}
