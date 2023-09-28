import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import AppError from "../config/AppError";
import {
	clearTokenCookie,
	isValidCookie,
	setTokenCookie,
} from "../lib/handleTokenCookie";
import isObjectId from "../lib/isObjectId";
import { UserDoc } from "../models/types/userTypes";
import { EmailVerifyInput, RegisterInput } from "../schema/authSchema";
import {
	createUser,
	findDuplicateUsernameOrEmail,
	findUser,
} from "../services/userServices";
import { TypedRequestBody } from "../types/requestTypes";
import {
	createEmailVerifyLink,
	sendVerifyEmail,
	sendWelcomeEmail,
} from "../util/email";
import {
	createJwtToken,
	getSecretKeyFor,
	getTokenExpireTime,
	getTokenExpireTimeNumber,
	verifyJwtToken,
} from "../util/jwt";
import {
	validateEmailTokenPayload,
	validateRefreshTokenPayload,
} from "../util/jwtPayloadValidators";
import logger from "../util/logger";
import { getClientURL } from "../config/clientURL";
import { isAppError, isJwtTokenError } from "../util/errorHandlerHelpers";

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
	const hashedPwd = await bcrypt.hash(password, SALT_ROUNDS);

	const newUser = await createUser({ ...req.body, password: hashedPwd });
	if (!newUser) {
		throw new AppError("Something went wrong", 500);
	}

	const user: Partial<UserDoc> = { ...newUser.toObject() };
	delete user.password;

	// send welcome email
	await sendWelcomeEmail({ to: newUser.email, name: newUser.name });

	const emailToken = createJwtToken({
		payload: { id: newUser._id.toString() },
		secretKey: getSecretKeyFor("email_token"),
		options: {
			expiresIn: getTokenExpireTime("email_token"),
		},
	});

	// send email verification mail
	await sendVerifyEmail({
		to: newUser.email,
		name: newUser.name,
		verifyLink: createEmailVerifyLink({ req, token: emailToken }),
		expireTimeInMins: getTokenExpireTimeNumber("email_token"),
	});

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
	const accessToken = createJwtToken({
		payload,
		secretKey: getSecretKeyFor("access_token"),
		options: {
			expiresIn: getTokenExpireTime("access_token"),
		},
	});
	const refreshToken = createJwtToken({
		payload,
		secretKey: getSecretKeyFor("refresh_token"),
		options: {
			expiresIn: getTokenExpireTime("refresh_token"),
		},
	});

	setTokenCookie(res, refreshToken);

	const user = await findUser({ _id: foundUser._id }, undefined, {
		populate: "followers",
	});
	res.json({ accessToken, user });
};

export const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!isValidCookie(cookies)) {
		throw new AppError("Unauthorized!", 401);
	}

	const refreshToken = cookies.token;
	const secretKey = getSecretKeyFor("refresh_token");

	const refreshTokenPayload = verifyJwtToken({
		token: refreshToken,
		secretKey,
	});

	const { error, value: validatedRefreshTokenPayload } =
		validateRefreshTokenPayload({ payload: refreshTokenPayload });
	if (error) {
		logger.error("Invalid refresh token payload");
		throw new AppError("Forbidden!", 403);
	}

	const userId = validatedRefreshTokenPayload.userInfo.id;

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

	//! Caution: Don't use `payload` received from verification for new access token's payload. It will cause error.
	const newAccessTokenPayload = {
		userInfo: { id: foundUser._id.toString() },
	};
	const accessToken = createJwtToken({
		payload: newAccessTokenPayload,
		secretKey: getSecretKeyFor("access_token"),
		options: {
			expiresIn: getTokenExpireTime("access_token"),
		},
	});
	res.json({ accessToken });
};

export const handleLogout = (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (cookies) {
		clearTokenCookie(res);
	}

	res.json({ message: "Logout successfully!" });
};

export const handleEmailVerfication = async (
	req: Request<EmailVerifyInput["params"]>,
	res: Response
) => {
	try {
		const token = req.params.token;

		const payload = verifyJwtToken({
			token,
			secretKey: getSecretKeyFor("email_token"),
		});

		const { value: validatedPayload, error } = validateEmailTokenPayload({
			payload,
		});
		if (error) {
			logger.error("Invalid email token!");
			throw new AppError("Forbidden!", 403);
		}

		const userId = validatedPayload.id;
		const foundUser = await findUser({ _id: userId });
		if (!foundUser) {
			logger.error("Invalid token payload!");
			throw new AppError("Forbidden!", 403);
		}

		// update user
		foundUser.emailVerified = true;
		await foundUser.save();

		// redirect user to login
		res.redirect(`${getClientURL()}/login`);
	} catch (err) {
		logger.error("Email verification route error!", err);

		if (!(err instanceof Error)) {
			return res.status(500).redirect(`${getClientURL()}/login`);
		}

		if (isJwtTokenError(err)) {
			res.status(401);
		} else if (isAppError(err)) {
			res.status(err.statusCode);
		} else {
			res.status(500);
		}

		res.redirect(`${getClientURL()}/login`);
	}
};

export const handleResendVerifyEmail = async (req: Request, res: Response) => {
	const user = req.user as UserDoc;

	const tokenPayload = { id: user._id.toString() };

	const emailToken = createJwtToken({
		payload: tokenPayload,
		secretKey: getSecretKeyFor("email_token"),
		options: {
			expiresIn: getTokenExpireTime("email_token"),
		},
	});

	await sendVerifyEmail({
		to: user.email,
		name: user.name,
		verifyLink: createEmailVerifyLink({ req, token: emailToken }),
		expireTimeInMins: getTokenExpireTimeNumber("email_token"),
	});

	res.json({ message: "Resent email successfully!" });
};
