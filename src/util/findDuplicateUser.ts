import User from "../models/User";

const findDuplicateWithUsernameAndEmail = async (
	username: string,
	email: string
) => {
	const duplicates = await User.aggregate([
		{
			$match: {
				$or: [
					{
						username: {
							$regex: `^${username}`,
							$options: "i",
						},
					},
					{ email },
				],
			},
		},
		{
			$group: {
				_id: "$_id",
				count: {
					$sum: 1,
				},
			},
		},
	]);

	return duplicates;
};

export default findDuplicateWithUsernameAndEmail;
