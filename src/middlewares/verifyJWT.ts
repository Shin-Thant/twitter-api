import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AppError from "../config/AppError";
import { getSecretKey } from "../lib/createToken";
import User from "../models/User";
import {
	isJWTPayloadValid,
	isValidBearerToken,
} from "../util/jwtVerifyHelpers";

// TODO: refactor after testing

export default async function verifyJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (!req.headers) {
			throw new AppError("Missing request headers!", 403);
		}
		if (
			!("authorization" in req.headers) &&
			!("Authorization" in req.headers)
		) {
			throw new AppError("Missing authorization header!", 403);
		}

		const bearerToken =
			req.headers.authorization || req.headers.Authorization;

		if (!isValidBearerToken(bearerToken)) {
			throw new AppError("Missing token in authorization header!", 403);
		}

		const accessToken = bearerToken.split(" ")[1];
		if (!accessToken) {
			throw new AppError("Access token required!", 401);
		}

		const secretKey = getSecretKey("access");
		jwt.verify(accessToken, secretKey, (err, payload) => {
			verifyCallback(err, payload, req, next);
		});
	} catch (err) {
		next(err);
	}
}

async function verifyCallback(
	err: jwt.VerifyErrors | null,
	payload: string | jwt.JwtPayload | undefined,
	req: Request,
	next: NextFunction
) {
	try {
		if (err) {
			throw err;
		}

		if (!isJWTPayloadValid(payload)) {
			console.log("invalid payload!");
			throw new AppError("Invalid token!", 403);
		}

		const id = payload.userInfo.id;
		const foundUser = await findUserByID(id);

		if (!foundUser) {
			throw new AppError("Forbidden!", 403);
		}

		req.user = foundUser;
		next();
	} catch (err) {
		if (err instanceof AppError) {
			return next(err);
		}

		if (!(err instanceof TokenExpiredError)) {
			const invalidTokenErr = new JsonWebTokenError("Invalid token!");
			return next(invalidTokenErr);
		}

		next(err);
	}
}

async function findUserByID(id: string) {
	const user = await User.findById(id);
	return user;
}
