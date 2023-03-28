import { Request, Response } from "express";
import AppError from "../config/AppError";
import User from "../models/User";

type ParamsType = { id?: string };
export const getUserById = async (req: Request<ParamsType>, res: Response) => {
	const { id } = req.params;
	if (!id) {
		return;
	}

	const foundUser = await User.findOne({ _id: id }).lean().exec();
	if (!foundUser) {
		throw new AppError("User not found!", 400);
	}

	res.json(foundUser);
};
