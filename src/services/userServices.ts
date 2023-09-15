import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import User from "../models/User";
import { UserDoc, UserSchema } from "../models/types/userTypes";
import { RegisterInput } from "../schema/authSchema";

type Filter = FilterQuery<UserDoc>;
type Options = QueryOptions<UserDoc>;

export async function createUser(input: RegisterInput) {
	return User.create(input);
}

export async function findUser(
	filter: Filter,
	projection?: ProjectionType<UserSchema>,
	options?: Options
) {
	return User.findOne(filter, projection, options).exec();
}

export async function findUsers(
	filter: Filter,
	projection?: ProjectionType<UserSchema>,
	options?: Options
) {
	return User.find(filter, projection, options).exec();
}

export async function findDuplicateUsernameOrEmail({
	username,
	email,
}: {
	username: string;
	email: string;
}): Promise<{ duplicateEmail: boolean; duplicateUsername: boolean }> {
	const duplicates = await findUsers(
		{
			$or: [{ username }, { email }],
		},
		undefined,
		{ lean: true }
	);

	const result = { duplicateEmail: false, duplicateUsername: false };
	duplicates.forEach((doc) => {
		if (doc.username === username) {
			result.duplicateUsername = true;
		}
		if (doc.email === email) {
			result.duplicateEmail = true;
		}
	});
	return result;
}

export async function paginateUser(
	filter: Filter,
	projection?: ProjectionType<UserSchema>,
	options?: {
		skip: number;
		limit: number;
		sort: string;
		lean?: boolean;
	}
) {
	return findUsers(filter, projection, { ...options });
}

export async function getUserCount(filter: Filter) {
	return User.countDocuments(filter);
}
