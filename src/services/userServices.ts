import User from "../models/User";
import { UserDoc, UserSchema } from "../models/types/userTypes";
import { RegisterInput } from "../validationSchemas/authSchema";
import { FindMany, FindOne, GetCount } from "./types";

export async function createUser(input: RegisterInput) {
	return User.create(input);
}

export async function findUser<TResult = UserDoc>(args: FindOne<UserSchema>) {
	return await User.findOne<TResult>(
		args.filter,
		args.projection,
		args.options
	).exec();
}

export async function findManyUsers(args: FindMany<UserSchema>) {
	return await User.find(args.filter, args.projection, args.options).exec();
}

export async function findDuplicateUsernameOrEmail({
	username,
	email,
}: {
	username: string;
	email: string;
}): Promise<{ duplicateEmail: boolean; duplicateUsername: boolean }> {
	const duplicates = await findManyUsers({
		filter: {
			$or: [{ username }, { email }],
		},
		options: { lean: true },
	});

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

export async function getUserCount(args: GetCount<UserSchema>) {
	return User.countDocuments(args.filter, args.options);
}
