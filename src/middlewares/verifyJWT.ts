import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../config/AppError";
import User from "../models/User";
import { getSecretKey } from "../lib/createToken";

interface ValidPayload {
	userInfo: {
		id: string;
	};
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
	const bearerToken = req.headers.authorization || req.headers.Authorization;
	if (!isValidBearerToken(bearerToken)) {
		throw new AppError("Unauthorized!", 401);
	}

	const accessToken = bearerToken.split(" ")[1];
	if (!accessToken) {
		throw new AppError("Unauthorized!", 401);
	}

	const secretKey = getSecretKey("access");
	jwt.verify(accessToken, secretKey, async (err, payload) => {
		try {
			if (err) {
				throw err;
			}
			if (!payload) {
				throw new AppError("Forbidden", 403);
			}
			if (!isJWTPayloadValid(payload)) {
				console.log("invalid payload!");
				throw new AppError("Unauthorized!", 401);
			}

			const id = payload.userInfo.id;
			const foundUser = await findUserWithID(id);
			if (!foundUser) {
				throw new AppError("Forbidden", 403);
			}
			req.user = foundUser;

			next();
		} catch (err) {
			next(err);
		}
	});
};

export default verifyJWT;

function isJWTPayloadValid(
	payload: string | JwtPayload
): payload is ValidPayload {
	return (
		!!payload &&
		typeof payload === "object" &&
		"userInfo" in payload &&
		"id" in payload.userInfo
	);
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

async function findUserWithID(id: string) {
	const user = await User.findById(id);
	return user;
}
