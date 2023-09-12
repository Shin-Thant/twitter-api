import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import AppError from "../config/AppError";
import createToken, { getSecretKeyFor } from "../lib/jwt";
import {
	clearTokenCookie,
	isValidCookie,
	setTokenCookie,
} from "../lib/handleTokenCookie";
import isObjectId from "../lib/isObjectId";
import verifyToken from "../lib/verifyToken";
import { TypedRequestBody } from "../types/requestTypes";
import { RegisterInput } from "../schema/authSchema";
import {
	createUser,
	findDuplicateUsernameOrEmail,
	findUser,
} from "../services/userServices";

export const handleRegister = async (
	req: TypedRequestBody<RegisterInput>,
	res: Response
) => {
	const { username, email, password } = req.body;

	const duplicates = await findDuplicateUsernameOrEmail({ username, email });
	if (duplicates.duplicateEmail) {
		throw new AppError("There is an account with this email!", 400);
	}
	if (duplicates.duplicateUsername) {
		throw new AppError("Username already taken!", 400);
	}

	const SALT_ROUNDS = 10;
	const encryptedPwd = await bcrypt.hash(password, SALT_ROUNDS);

	const newUser = await createUser({ ...req.body, password: encryptedPwd });
	if (!newUser) {
		throw new AppError("Something went wrong", 500);
	}

	// TODO: test this
	const user = await findUser({ _id: newUser._id });
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

	// TODO: test this
	const foundUser = await findUser(
		{ email },
		{ password: true },
		{ lean: true }
	);
	if (!foundUser) {
		throw new AppError("Invalid email or password!", 400);
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		foundUser.password
	);
	if (!isPasswordMatched) {
		throw new AppError("Invalid email or password!", 400);
	}

	const payload = {
		userInfo: { id: foundUser._id.toString() },
	};
	const accessToken = createToken(payload, "access_token");
	const refreshToken = createToken(payload, "refresh_token");

	setTokenCookie(res, refreshToken);

	const user = await findUser({ _id: foundUser._id }, undefined, {
		populate: "followers",
	});
	res.json({ accessToken, user });
};

// TODO: test this
// TODO: refactor this
export const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!isValidCookie(cookies)) {
		throw new AppError("Unauthorized!", 401);
	}

	const refreshToken = cookies.token;
	const secretKey = getSecretKeyFor("refresh_token");
	const payload = verifyToken(refreshToken, secretKey);

	const userId = payload.userInfo.id;
	if (!isObjectId(userId)) {
		throw new AppError("Unauthorized!", 401);
	}
	const foundUser = await findUser({ _id: userId }, undefined, {
		lean: true,
	});

	if (!foundUser) {
		clearTokenCookie(res);
		throw new AppError("Unauthorized!", 401);
	}

	// Caution: Don't use `payload` received from verification for new access token's payload. It will cause error.
	const accessToken = createToken(
		{ userInfo: { id: foundUser._id.toString() } },
		"access_token"
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
