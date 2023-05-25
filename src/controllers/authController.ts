import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import AppError from "../config/AppError";
import createToken, { getSecretKey } from "../lib/createToken";
import {
	clearTokenCookie,
	isValidCookie,
	setTokenCookie,
} from "../lib/handleTokenCookie";
import isObjectId from "../lib/isObjectId";
import santitizeUserData from "../lib/validateUserCreation";
import verifyToken from "../lib/verifyToken";
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

	const user = await User.findById(newUser._id)
		.select(["-following", "-followers"])
		.lean()
		.exec();
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
		throw new AppError("Invalid email!", 400);
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
	const refreshToken = createToken(payload, "refresh");

	setTokenCookie(res, refreshToken);

	const user = await User.findById(foundUser._id)
		.populate("followers")
		.lean()
		.exec();
	res.json({ accessToken, user });
};

// TODO: test this
// TODO: refactor this
export const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!isValidCookie(cookies)) {
		console.log("cookie error");
		throw new AppError("Unauthorized!", 401);
	}

	const refreshToken = cookies.token;
	const secretKey = getSecretKey("refresh");
	const payload = verifyToken(refreshToken, secretKey);

	const userId = payload.userInfo.id;
	if (!isObjectId(userId)) {
		throw new AppError("Unauthorized!", 401);
	}
	const foundUser = await User.findById(userId).lean().exec();

	if (!foundUser) {
		console.log("user not found!");
		throw new AppError("Unauthorized!", 401);
	}

	// Caution: Don't use `payload` received from verification for new access token's payload. It will cause error.
	const accessToken = createToken(
		{ userInfo: { id: foundUser._id.toString() } },
		"access"
	);
	res.json({ accessToken });
};

export const handleLogout = (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (cookies) {
		clearTokenCookie(res);
	}

	res.json({ message: "Logout successfully!" });
};
