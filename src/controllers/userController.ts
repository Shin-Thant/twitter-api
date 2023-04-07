import { Request, Response } from "express";
import AppError from "../config/AppError";
import PaginationImpl from "../lib/pagination";
import User from "../models/User";
import { TypedRequestQuery } from "../types";
import { checkValuesString } from "../util/paginationHelper";
import { UpdateReqBody } from "./types/userTypes";
import { validateUserUpdateInput } from "../util/validateUserUpdateInput";

type Params = { userId?: string };

type SearchQuery = {
	name?: string;
	currentPage?: string;
	itemsPerPage?: string;
};
export const searchUsers = async (
	req: TypedRequestQuery<SearchQuery>,
	res: Response
) => {
	const { name, currentPage, itemsPerPage } = req.query;

	if (!name || !currentPage || !itemsPerPage) {
		throw new AppError("All fields is required!", 400);
	}
	if (checkValuesString(itemsPerPage, currentPage)) {
		throw new AppError("Enter valid values", 400);
	}

	// TODO: change this regex (select name or username that include provided query string)
	const REGEX_QUERY = { $regex: `^${name}`, $options: "i" };

	const totalUsers = await User.countDocuments({
		$or: [{ name: REGEX_QUERY }, { username: REGEX_QUERY }],
	});

	const userPagination = new PaginationImpl(
		parseInt(itemsPerPage),
		parseInt(currentPage),
		totalUsers
	);

	// TODO: add sorting features
	// default sort = `createdAt`
	const users = await User.find({
		name: REGEX_QUERY,
	})
		.limit(userPagination.itemsPerPage)
		.skip(userPagination.skip)
		.sort("-createdAt")
		.lean();

	res.json(userPagination.createPaginationResult<typeof users>(users));
};

export const getUserById = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		return;
	}

	const foundUser = await User.findOne({ _id: userId }).lean().exec();
	if (!foundUser) {
		throw new AppError("User not found!", 400);
	}

	res.json(foundUser);
};

// *update name, email and avatar
export const updateUserGeneralInfo = async (
	req: Request<Params, object, UpdateReqBody>,
	res: Response
) => {
	const { name, email, avatar } = req.body;
	const { userId } = req.params;
	if (!userId || !name || !email) {
		throw new AppError("All fields are required!", 400);
	}

	const user = await User.findById(userId).exec();
	if (!user) {
		throw new AppError("Invalid user id!", 400);
	}

	const inputs = { name, email, avatar: avatar || "" };
	const { value, error } = validateUserUpdateInput(inputs);
	if (error) {
		throw error;
	}

	const duplicateUser = await User.findOne({ name })
		.collation({
			locale: "en",
			strength: 2,
		})
		.lean()
		.exec();
	if (duplicateUser && duplicateUser._id.toString() !== userId) {
		throw new AppError("User name already existed!", 400);
	}

	// update user
	user.name = value.name;
	user.email = value.email;
	user.avatar = value.avatar;
	await user.save();

	res.json(user);
};

export const deleteUser = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		throw new AppError("User ID is required!", 400);
	}

	const user = await User.findById(userId).exec();
	if (!user) {
		throw new AppError("User not found!", 400);
	}

	await user.deleteOne();
	res.json({ message: "User deleted successfully!" });
};
