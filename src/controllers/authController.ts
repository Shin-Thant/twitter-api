import bcrypt from "../lib/bcrypt";
import { Response } from "express";
import { SignOptions } from "jsonwebtoken";
import AppError from "../config/AppError";
import jwt from "../lib/jwt";
import User from "../models/User";
import { TypedRequestBody } from "../types";

type RegisterReqBody = {
	name?: string;
	email?: string;
	password?: string;
};
export const handleRegister = async (
	req: TypedRequestBody<RegisterReqBody>,
	res: Response
) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		throw new AppError("All fields are required!", 400);
	}

	const duplicateUser = await User.findOne({ email }).exec();
	if (duplicateUser) {
		throw new AppError("User already existed with this email!", 400);
	}

	const SALT_ROUNDS = 10;
	const encryptedPwd = await bcrypt.hash(password, SALT_ROUNDS);

	const a: unknown = 1111;
	const newUserDoc = await User.create({
		name: a,
		email,
		password: encryptedPwd,
	});
	if (!newUserDoc) {
		throw new AppError("Something went wrong", 500);
	}

	// turn document to object
	// const newUser: Partial<typeof newUserDoc> = newUserDoc.toObject(); // to include virtual properties, add `{getters: true}` option
	// delete newUser.password;
	res.status(201).json(newUserDoc);
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

	const jwtSignOptions: SignOptions = {
		expiresIn: "15min",
	};
	const accessToken = jwt.createToken(
		{ userInfo: { id: foundUser._id } },
		process.env.ACCESS_TOKEN_SECRET_KEY,
		jwtSignOptions
	);

	res.json({ status: "success", accessToken });
};
