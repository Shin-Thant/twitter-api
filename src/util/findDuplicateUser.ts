import User from "../models/User";

const findDuplicateWithUsernameAndEmail = async (
	username: string,
	email: string
) => {
	const duplicateEmail = await User.findOne({ email }).lean().exec();
	const duplicateUsername = await User.findOne({ username }).lean().exec();

	return {
		duplicateUsername: duplicateUsername,
		duplicateEmail: duplicateEmail,
	};
};

export default findDuplicateWithUsernameAndEmail;
