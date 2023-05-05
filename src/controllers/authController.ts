import bcrypt from "bcrypt";
import type { Response, CookieOptions, Request } from "express";
import AppError from "../config/AppError";
import createToken from "../lib/createToken";
import santitizeUserData from "../lib/validateUserCreation";
import User from "../models/User";
import { TypedRequestBody } from "../types/requestTypes";
import findDuplicateWithUsernameAndEmail from "../util/findDuplicateUser";

type RegisterReqBody = {
	username?: string;
	name?: string;
	email?: string;
	password?: string;
};
export const handleRegister = async (
	req: TypedRequestBody<RegisterReqBody>,
	res: Response
) => {
	const { username, name, email, password } = req.body;
	if (!username || !name || !email || !password) {
		throw new AppError("All fields are required!", 400);
	}

	const duplicates = await findDuplicateWithUsernameAndEmail(username, email);
	if (duplicates.duplicateEmail) {
		throw new AppError("Email already used!", 400);
	}
	if (duplicates.duplicateUsername) {
		throw new AppError("Username already taken!", 400);
	}

	// *validate user data
	const validatedResult = santitizeUserData({
		username,
		name,
		email,
		password,
	});
	if (validatedResult.error) {
		throw validatedResult.error;
	}

	const SALT_ROUNDS = 10;
	const encryptedPwd = await bcrypt.hash(password, SALT_ROUNDS);
	validatedResult.value.password = encryptedPwd;

	const newUser = await User.create({ ...validatedResult.value });
	if (!newUser) {
		throw new AppError("Something went wrong", 500);
	}

	// turn document to object
	const user = await User.findById(newUser._id);
	res.status(201).json(user);
};

type LoginReqBody = {
	email?: string;
	password?: string;
};
export const handleLogin = async (
	req: TypedRequestBody<LoginReqBody>,
	res: Response
) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new AppError("All fields are required!", 400);
	}

	const foundUser = await User.findOne({ email })
		.select("password")
		.lean()
		.exec();
	if (!foundUser) {
		throw new AppError("Invalid email or password!", 400);
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		foundUser.password
	);
	if (!isPasswordMatched) {
		throw new AppError("Wrong Password!", 400);
	}

	const payload = {
		userInfo: { id: foundUser._id.toString() },
	};
	const accessToken = createToken(payload, "access");

	const cookieOptions: CookieOptions = {
		httpOnly: true,
		maxAge: 15 * 60 * 1000,
		sameSite: "strict",
		secure: true,
	};
	res.cookie("accessToken", accessToken, cookieOptions);

	const user = await User.findById(foundUser._id);
	res.json({ accessToken, user });
};

export const handleLogout = (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (cookies) {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		};
		res.clearCookie("accessToken", cookieOptions);
	}

	res.json({ message: "Logout successfully!" });
};
