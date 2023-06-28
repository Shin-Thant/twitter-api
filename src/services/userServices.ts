import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import User from "../models/User";
import { UserDoc, UserSchema } from "../models/types/userTypes";
import { RegisterInput } from "../schema/authSchema";

export async function createUser(input: RegisterInput) {
	return User.create(input);
}

export async function findUser(
	query: FilterQuery<UserDoc>,
	projection?: ProjectionType<UserSchema>,
	options?: QueryOptions<UserDoc>
) {
	return User.findOne(query, projection, options).exec();
}

export async function findUsers(
	query: FilterQuery<UserDoc>,
	projection?: ProjectionType<UserSchema>,
	options?: QueryOptions<UserDoc>
) {
	return User.find(query, projection, options).exec();
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
	query: FilterQuery<UserDoc>,
	projection?: ProjectionType<UserSchema>,
	options?: {
		skip: number;
		limit: number;
		sort: string;
		lean?: boolean;
	}
) {
	return findUsers(query, projection, { ...options });
}

export async function getUserDocumentCount(query: FilterQuery<UserDoc>) {
	return User.countDocuments(query);
}
