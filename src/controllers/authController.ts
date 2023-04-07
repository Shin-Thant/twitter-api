import bcrypt from "bcrypt";
import type { Response, CookieOptions, Request } from "express";
import AppError from "../config/AppError";
import createToken from "../lib/createToken";
import validateUser from "../lib/validateUserCreation";
import User, { IUser } from "../models/User";
import { TypedRequestBody } from "../types";
import findDuplicateWithUserNameAndEmail from "../util/findDuplicateUser";

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

	const duplicates = await findDuplicateWithUserNameAndEmail(username, email);
	if (duplicates.length > 0) {
		throw new AppError("User already existed with this email!", 400);
	}

	// *validate user data
	const validatedResult = validateUser({ username, name, email, password });
	if (validatedResult.error) {
		throw validatedResult.error;
	}

	const SALT_ROUNDS = 10;
	const encryptedPwd = await bcrypt.hash(password, SALT_ROUNDS);
	validatedResult.value.password = encryptedPwd;

	const newUserDoc = await User.create({ ...validatedResult.value });
	if (!newUserDoc) {
		throw new AppError("Something went wrong", 500);
	}

	// turn document to object
	const newUser: Partial<IUser> = newUserDoc.toObject<IUser>(); // to include virtual properties, add `{getters: true}` option
	delete newUser.password;
	res.status(201).json(newUser);
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
		userInfo: { id: foundUser._id },
	};
	const accessToken = createToken(payload, "access", "15m");

	const cookieOptions: CookieOptions = {
		httpOnly: true,
		maxAge: 15 * 60 * 1000,
		sameSite: "strict",
		secure: true,
	};
	res.cookie("accessToken", accessToken, cookieOptions);

	res.json({ status: "success", accessToken });
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

	res.json({ status: "success", message: "Logout successfully!" });
};
