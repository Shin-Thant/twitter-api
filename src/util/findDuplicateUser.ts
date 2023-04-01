import User from "../models/User";

const findDuplicateWithUserNameAndEmail = async (
	username: string,
	email: string
) => {
	const duplicates = await User.aggregate([
		{
			$match: {
				username: {
					$regex: `^${username}`,
					$options: "i",
				},
				email,
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

	// const duplicates = await User.findOne({
	//     $or: [
	//         {
	//             username:
	//         }
	//     ]
	// })

	return duplicates;
};

export default findDuplicateWithUserNameAndEmail;
