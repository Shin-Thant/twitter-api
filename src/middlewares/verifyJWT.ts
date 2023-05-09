import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import { getSecretKey } from "../lib/createToken";
import User from "../models/User";
import verifyToken from "../lib/verifyToken";

export default async function verifyJWT(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	try {
		verifyAuthorizationHeader(req);

		const accessToken = getTokenFromRequest(req);
		const secretKey = getSecretKey("access");
		const payload = verifyToken(accessToken, secretKey);

		const userId = payload.userInfo.id;
		const foundUser = await findUserByID(userId);

		if (!foundUser) {
			throw new AppError("Forbidden!", 403);
		}

		req.user = foundUser;
		next();
	} catch (err) {
		next(err);
	}
}

function verifyAuthorizationHeader(req: Request) {
	if (!req.headers) {
		throw new AppError("Missing request headers!", 403);
	}
	if (
		!("authorization" in req.headers) &&
		!("Authorization" in req.headers)
	) {
		throw new AppError("Missing authorization header!", 403);
	}
}

function getTokenFromRequest(req: Request) {
	const bearerToken = getBearerTokenFromReqHeader(req);
	if (!isValidBearerToken(bearerToken)) {
		throw new AppError("Missing token in authorization header!", 403);
	}

	const token = bearerToken.split(" ")[1];
	if (!token) {
		throw new AppError("Access token required!", 401);
	}
	return token;
}

function getBearerTokenFromReqHeader(req: Request) {
	return req.headers.authorization || req.headers.Authorization;
}

function isValidBearerToken(
	bearerToken?: string | string[]
): bearerToken is string {
	return (
		!!bearerToken &&
		!Array.isArray(bearerToken) &&
		bearerToken.startsWith("Bearer ")
	);
}

async function findUserByID(id: string) {
	const user = await User.findById(id);
	return user;
}
