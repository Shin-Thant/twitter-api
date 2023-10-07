import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import AppError from "../config/AppError";
import isObjectId from "../lib/isObjectId";
import PaginationImpl from "../lib/pagination";
import User from "../models/User";
import { UserDoc } from "../models/types/userTypes";
import {
	findManyUsers,
	findUser,
	getUserCount,
} from "../services/userServices";
import { TypedRequestQuery } from "../types/requestTypes";
import { areValuesNumber } from "../util/areValuesNumber";
import PaginationHelperImpl from "../util/paginationHelper";
import {
	UpdateReqBody,
	validateUserUpdateInput,
} from "../util/validateUserUpdateInput";

const paginationHelper = new PaginationHelperImpl();

export const getMe = async (req: Request, res: Response) => {
	const { user } = req;
	if (!user) {
		throw new AppError("No user!", 400);
	}
	await user.populate({ path: "following", select: "-following" });
	await user.populate({ path: "followers", select: "-following" });
	res.json(user);
};

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
	if (areValuesNumber(itemsPerPage, currentPage)) {
		throw new AppError("Enter valid values", 400);
	}

	// \\b\\w*${name}\\w*\\b
	const REGEX_OPTION = { $regex: `.*${name}.*`, $options: "i" };
	const QUERY_FILTER: FilterQuery<UserDoc> = {
		$or: [{ name: REGEX_OPTION }, { username: REGEX_OPTION }],
	};

	const totalUsers = await getUserCount(QUERY_FILTER);

	const userPagination = new PaginationImpl({
		itemsPerPage: parseInt(itemsPerPage),
		currentPage: parseInt(currentPage),
		totalDocs: totalUsers,
		helper: paginationHelper,
	});

	const users = await findManyUsers({
		filter: QUERY_FILTER,
		projection: { following: false },
		options: {
			limit: userPagination.itemsPerPage,
			skip: userPagination.skip,
			sort: "name",
			lean: true,
		},
	});

	res.json(userPagination.createPaginationResult<typeof users>(users));
};

export const getUserById = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		return;
	}

	const foundUser = await findUser({
		filter: { _id: userId },
		projection: { following: false },
		options: { lean: true },
	});
	if (!foundUser) {
		throw new AppError("User not found!", 400);
	}

	res.json(foundUser);
};

export const getUserFollowing = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		throw new AppError("User ID is required!", 400);
	}

	const foundUser = await findUser({
		filter: { _id: userId },
		options: {
			populate: { path: "following", select: "-following" },
		},
	});
	if (!foundUser) {
		throw new AppError("Invalid ID!", 400);
	}

	res.json(foundUser.following);
};

export const getUserFollowers = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		throw new AppError("User ID is required!", 400);
	}

	const foundUser = await findUser({
		filter: { _id: userId },
		options: {
			populate: "followers",
		},
	});
	if (!foundUser) {
		throw new AppError("Invalid ID!", 400);
	}

	res.json(foundUser.followers);
};

type FollowParam = {
	userId?: string;
};
export const followUser = async (req: Request<FollowParam>, res: Response) => {
	const { user: currentUser } = req;
	const { userId } = req.params;

	if (!currentUser || !userId) {
		throw new AppError("All fields are required!", 400);
	}

	const foundUser = await validateFollowId(
		currentUser._id.toString(),
		userId
	);

	if (currentUser.following.indexOf(userId) !== -1) {
		throw new AppError("Already followed!", 400);
	}

	// updates
	currentUser.following.push(userId);
	currentUser.counts.following += 1;
	await currentUser.save();

	foundUser.counts.followers += 1;
	await foundUser.save();

	res.json({ message: `Followed ${foundUser.username}!` });
};

export const unfollowUser = async (
	req: Request<FollowParam>,
	res: Response
) => {
	const { user } = req;
	const { userId } = req.params;
	if (!user || !userId) {
		throw new AppError("All fields are required!", 400);
	}

	const foundUser = await validateFollowId(user._id.toString(), userId);

	const index = user.following.indexOf(userId);
	if (index === -1) {
		throw new AppError("Invalid user!", 400);
	}

	user.following.splice(index, index + 1);
	await user.save();
	res.json({ message: `Unfollowed ${foundUser.username}!` });
};

async function validateFollowId(loginedUserId: string, userId: string) {
	if (!isObjectId(userId)) {
		throw new AppError("Invalid user!", 400);
	}
	if (loginedUserId === userId) {
		throw new AppError("Bad request!", 400);
	}
	const foundUser = await findUser({ filter: { _id: userId } });
	if (!foundUser) {
		throw new AppError("Invalid user!", 400);
	}
	return foundUser;
}

export const updateUserGeneralInfo = async (
	req: Request<Params, object, UpdateReqBody>,
	res: Response
) => {
	const { name, avatar } = req.body;
	const { userId } = req.params;
	if (!userId || !name) {
		throw new AppError("All fields are required!", 400);
	}

	const user = await findUser({ filter: { _id: userId } });
	if (!user) {
		throw new AppError("Invalid user id!", 400);
	}

	const inputs = { name, avatar: avatar || "" };
	const { value, error } = validateUserUpdateInput(inputs);
	if (error) {
		throw error;
	}

	const duplicateUser = await findUser({
		filter: { name },
		options: {
			collation: {
				locale: "en",
				strength: 2,
			},
		},
	});
	if (duplicateUser && duplicateUser._id.toString() !== userId) {
		throw new AppError("User name already existed!", 400);
	}

	// update user
	user.name = value.name;
	user.avatar = value.avatar;
	await user.save();

	res.json(user);
};

export const deleteUser = async (req: Request<Params>, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		throw new AppError("User ID is required!", 400);
	}

	const user = await findUser({ filter: { _id: userId } });
	if (!user) {
		throw new AppError("User not found!", 400);
	}

	await user.deleteOne();

	// TODO: test this work
	await User.updateMany(
		{ _id: { $in: user.following } },
		{ $inc: { "counts.followers": -1 } }
	).exec();

	res.json({ message: "User deleted successfully!" });
};
