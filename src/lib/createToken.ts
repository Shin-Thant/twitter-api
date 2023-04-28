import jwt from "jsonwebtoken";
import AppError from "../config/AppError";

const createToken = (payload: object, tokenType: TokenType): string => {
	if (Object.keys(payload).length < 1) {
		throw new AppError("Invalid jwt payload!", 500);
	}

	const secretKey = getSecretKey(tokenType);
	if (!secretKey || !secretKey.length) {
		throw new AppError("No secret key!", 500);
	}

	const expiresIn = getExpiresTimeString(tokenType);

	return jwt.sign(payload, secretKey, {
		expiresIn,
	});
};

type TokenType = "access" | "refresh";
export const getSecretKey = (tokenType: TokenType): string => {
	if (tokenType === "access") {
		return (
			process.env.ACCESS_TOKEN_SECRET_KEY || "unique-access-token-secret"
		);
	}
	return process.env.REFRESH_TOKEN_SECRET_KEY || "unique-access-token-secret";
};

export const getExpiresTimeString = (tokenType: TokenType) => {
	return tokenType === "access" ? "15m" : "7d";
};

export default createToken;
